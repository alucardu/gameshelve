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
    <label>
      Name has to be more than 3 characters long.
      <input
        type="text"
        placeholder="name of the game"
        v-on:keyup='toggleButton($event.target.value)'
        v-model="gameName"
        :disabled="file ? false : true"
      />
    </label>
    <button
      @click="upload()"
      class="button--grey"
      :disabled="uploadDisabled"
    >
      Upload
    </button>
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
      gameName: '',
      fileExtension: '',
      images: [],
      uploadDisabled: true,
      file: null,
      gallery: [],
    }
  },
  methods: {
    setFile (error, file) {
      this.fileExtension = '.' +  file.fileExtension
      this.file = this.$refs.pond.getFile().file
      this.toggleButton()
    },

    toggleButton: debounce(function (gameName) {
      if (this.checkIfGameIsDuplicate(this.gallery, gameName)) {
        console.log('game already exists')
        this.uploadDisabled = true
      } else {
        if (gameName && gameName.length > 3) {
          this.uploadDisabled = this.$refs.pond.getFiles().length > 0 ? false : true
        } else {
          this.uploadDisabled = true
        }
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
          this.$store.dispatch('myGallery/imageAdded', data)
          this.addImageToGallery()
        },
        (err) => {
          console.log("There was an error uploading your photo: ", err);
        }
      );
    },

    addImageToGallery () {
      localforage.getItem('myGallery').then((value) => {
          const myArray = value || []
          myArray.push({ Key: this.gameName + this.fileExtension })
          localforage.setItem('myGallery', myArray)
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
    console.log(this.GalleryStore.length === 0)
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
