<template>
  <div class="c-filepond">
    <file-pond
      ref="pond"
      label-idle="Drop file here..."
      v-bind:allow-multiple="false"
      accepted-file-types="image/jpeg, image/png"
      @addfile="setFile"
      @removefile="removeFile()"
    />
    <form class="c-filepond__form" @submit.prevent>
      <label>
        <input
          class="input"
          type="text"
          placeholder="name of the game"
          v-on:keyup='toggleButton($event.target.value)'
          v-model="$v.gameForm.gameName.$model"
          :disabled="uploadDisabled"
        />
        <div class="formError">
          <span v-if="!$v.gameForm.gameName.required && !uploadDisabled">A name is required to upload the file.</span>
          <span v-if="!$v.gameForm.gameName.alpha">The name can only be a single word (no spaces or numbers or symbols)</span>
          <span v-if="!$v.gameForm.gameName.minLength">Name has to be more than 3 characters long.</span>
          <span v-if="!gameIsUnique">A game with that name already exists.</span>
        </div>
        <ul v-if="game">
          <GameImage
            :game="game"
            v-on:add-game-to-dashboard="addGametoDashboard"
            galleryType="globalGallery"
          />
          <li />
        </ul>
      </label>
      <fieldset class="flex flex-col">
        <label>
          <input
            type="radio"
            name="drone"
            value="myGallery"
            v-model="gameForm.type"
            :disabled="uploadDisabled"
            @click="toggleButton()"
          />
          Game I want to play
        </label>
        <label>
          <input
            type="radio"
            name="drone"
            value="wantToLearn"
            v-model="gameForm.type"
            :disabled="uploadDisabled"
            @click="toggleButton()"
          />
          Game I want to learn
        </label>
      </fieldset>
      <button
        @click="upload()"
        class="button"
        :disabled="uploadDisabled || $v.gameForm.$invalid"
      >
        Upload
      </button>
    </form>
  </div>
</template>

<script>
import AWS from 'aws-sdk'
import localforage from 'localforage';
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import { debounce } from 'lodash';
import { mapGetters } from 'vuex';
import listImages from '~/mixins/listImages.js';

import { required, minLength, alpha } from 'vuelidate/lib/validators'

AWS.config.update({
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.identityPoolId
  }),
  region: 'eu-central-1'
});

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
);

export default {
  mixins: [listImages ],
  data() {
    return {
      game: null,
      gameIsUnique: true,
      gameForm: {
        gameName: '',
        type: undefined
      },
      type: null,
      gameName: '',
      fileExtension: '',
      images: [],
      uploadDisabled: true,
      file: null,
      gallery: [],
    }
  },

  validations: {
    gameForm: {
      gameName: { required, minLength: minLength(4), alpha },
      type: { required }
    }
  },
  methods: {
    addGametoDashboard(...args) {
      const [game, type] = args
      this.gameForm.type = type
      if (this.checkIfGameIsDuplicate(this.whatStore(type), game.Key.substring(0, game.Key.lastIndexOf('.')))) {
        this.$notifier.showMessage({ content: 'game already added to shelve', color: 'warning' })
        this.$refs.pond.removeFiles()
        this.game = null
      } else {
        if (this.checkIfGameIsDuplicate(this.returnOpositeType(type), game.Key.substring(0, game.Key.lastIndexOf('.')))) {
          console.log('game is already added')
          this.$refs.pond.removeFiles()
          this.game = null
        } else {
          this.addImageToGallery()
          this.$store.dispatch(this.gameForm.type + '/imageAdded', game)
          this.$refs.pond.removeFiles()
          this.uploadDisabled = true
          this.gameIsUnique = true
        }
      }
    },

    whatStore(type) {
      switch (type) {
        case 'myGallery':
          return this.wantToPlayStore
        case 'wantToLearn':
          return this.wantToLearnStore
      }
    },

    returnOpositeType (type) {
      switch (type) {
        case 'myGallery': return this.wantToLearnStore
        case 'wantToLearn': return this.wantToPlayStore
      }
    },

    removeFile (error, file) {
      this.gameForm.gameName = ''
      this.uploadDisabled = true
      document.getElementsByClassName("c-filepond__form")[0].reset()
    },
    setFile (error, file) {
      this.fileExtension = '.' +  file.fileExtension
      this.file = this.$refs.pond.getFile().file
      this.toggleButton()
    },

    toggleButton: debounce(function () {
      if (this.checkIfGameIsDuplicate(this.gallery, this.gameForm.gameName)) {
        this.gameIsUnique = false
        this.uploadDisabled = true
      } else {
        this.gameIsUnique = true
        this.uploadDisabled = this.$refs.pond.getFiles().length > 0 ? false : true
      }

    }, 100),

    checkIfGameIsDuplicate (games, game) {
      for (const item of games) {
        if (item.Key.toUpperCase().substr(0, item.Key.lastIndexOf(".")) === game.toUpperCase()) {
          this.game = item
          return true
        }
      }
      return false
    },

    upload () {
      const upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: 'gameshelve',
          Key: this.gameForm.gameName + this.fileExtension,
          Body: this.file
        }
      })

      const promise = upload.promise();

      promise.then(
        (data) => {
          this.addImageToGallery()
          this.$store.dispatch(this.gameForm.type + '/imageAdded', data)
        },
        (err) => {
          console.log("There was an error uploading your photo: ", err);
        }
      );
    },

    addImageToGallery () {
      localforage.getItem(this.gameForm.type).then((value) => {
        const myArray = value || []
        myArray.push({
          Key: this.gameForm.gameName + this.fileExtension,
          shelve: this.gameForm.type
        })
        localforage.setItem(this.gameForm.type, myArray)
        this.$refs.pond.removeFiles()
        this.gameForm.gameName = ''
        this.game = null
        document.getElementsByClassName("c-filepond__form")[0].reset()
      }).catch(function(err) {
        console.log(err);
      });
    }
  },

  computed: {
    ...mapGetters({
      GalleryStore: 'gallery/getGallery',
      wantToPlayStore: 'myGallery/getGallery',
      wantToLearnStore: 'wantToLearn/getGallery',
    })
  },

  watch: {
    GalleryStore: {
      handler (GalleryStore) {
        this.gallery = GalleryStore
      }
    }
  },

  mounted () {
    this.GalleryStore.length === 0 ? this.listImages() : this.gallery = this.GalleryStore;
  },


}
</script>

<style lang="scss">
.c-filepond {
  @apply mt-4;

  .filepond--root {
    height: 20rem;
  }

  .filepond--drop-label {
    height: 100%;
  }
  @apply flex;

  .filepond--wrapper {
    @apply w-2/4 mr-4;
  }

  &__form {
    @apply w-2/4;
  }
}

button {
  @apply m-0;
}

// input[type="text"]:disabled {
//   background: red;
// }
// input {
//   background: grey;
//   color: white;
//   padding: 12px;
// }
</style>
