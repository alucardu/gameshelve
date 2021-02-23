<template>
  <div>
    <file-pond
      ref="pond"
      label-idle="Drop file here..."
      v-bind:allow-multiple="false"
      accepted-file-types="image/jpeg, image/png"
      @addfile="setFile"
      @removefile="toggleButton()"
    />
    <form id="myForm">
      <label>
        <input
          type="text"
          placeholder="name of the game"
          v-on:keyup='toggleButton($event.target.value)'
          v-model="$v.gameForm.gameName.$model"
          :disabled="file ? false : true"
        /><br>
        <br>
        <div v-if="($v.gameForm.gameName.$error)">
          <span v-if="!$v.gameForm.gameName.required">A name is required to upload the file.</span>
          <span v-if="!$v.gameForm.gameName.minLength">Name has to be more than 3 characters long.</span>
        </div>
      </label>
      <label>
        Games I want to play:
        <input
          type="radio"
          name="drone"
          value="myGallery"
          v-model="gameForm.type"
          @click="toggleButton(gameName)"
        />
      </label>
      <label>
        Games I want to learn:
        <input
          type="radio"
          name="drone"
          value="wantToLearn"
          v-model="gameForm.type"
          @click="toggleButton(gameName)"
        />
      </label>
      <div v-if="(!$v.gameForm.type.required)">
        Please select a type
      </div>
      <button
        @click="upload()"
        class="button--grey"
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

import { required, minLength } from 'vuelidate/lib/validators'

AWS.config.update({
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.IDENTITY_POOL_ID
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
      gameName: { required, minLength: minLength(4) },
      type: { required }
    }
  },
  methods: {
    setFile (error, file) {
      this.fileExtension = '.' +  file.fileExtension
      this.file = this.$refs.pond.getFile().file
      this.toggleButton()
    },

    toggleButton: debounce(function () {
      if (this.checkIfGameIsDuplicate(this.gallery, this.gameForm.gameName)) {
        console.log('game already exists')
      } else {
        this.uploadDisabled = this.$refs.pond.getFiles().length > 0 ? false : true
      }

    }, 100),

    checkIfGameIsDuplicate (games, game) {
      for (const item of games) {
        if (item.Key.substr(0, item.Key.lastIndexOf(".")) === game) return true
      }
      return false
    },

    upload () {
      const upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: 'gamesnap',
          Key: this.gameName + this.fileExtension,
          Body: this.file
        }
      })

      const promise = upload.promise();

      promise.then(
        (data) => {
          this.addImageToGallery()
          this.$store.dispatch(this.type + '/imageAdded', data)
        },
        (err) => {
          console.log("There was an error uploading your photo: ", err);
        }
      );
    },

    addImageToGallery () {
      localforage.getItem(this.type).then((value) => {
        const myArray = value || []
        myArray.push({
          Key: this.gameName + this.fileExtension,
          shelve: this.type
        })
        localforage.setItem(this.type, myArray)
        this.$refs.pond.removeFiles()
        this.gameName = ''
        document.getElementById("myForm").reset()
      }).catch(function(err) {
        console.log(err);
      });
    }
  },

  computed: {
    ...mapGetters({
      GalleryStore: 'gallery/getGallery',
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
input[type="text"]:disabled {
  background: red;
}
button:disabled,
button[disabled] {
  color: red
}
input {
  background: grey;
  color: white;
  padding: 12px;
}
</style>
