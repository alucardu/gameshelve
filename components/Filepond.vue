<template>
  <div>
    <file-pond
      ref="pond"
      label-idle="Drop files here..."
      v-bind:allow-multiple="false"
      accepted-file-types="image/jpeg, image/png"
      :files="myFiles"
      @addfile="toggleButton(); setFile()"
      @removefile="toggleButton()"
    />
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
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

export default {
  data: function() {
    return {
      myFiles: [],
      images: [],
      uploadDisabled: true,
      file: null,
    }
  },
  methods: {
    setFile () {
      this.file = this.$refs.pond.getFile().file
    },
    toggleButton () {
      this.uploadDisabled = this.$refs.pond.getFiles().length > 0 ? false : true
    },
    upload () {
      const upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: 'gamesnap',
          Key: this.file.name,
          Body: this.$refs.pond.getFile().file
        }
      })

      const promise = upload.promise();

      promise.then(
        (data) => {
          this.$store.dispatch('gallery/imageUploaded', data)
        },
        (err) => {
          console.log("There was an error uploading your photo: ", err);
        }
      );
    }
  }


}
</script>

<style lang="scss">
button:disabled,
button[disabled] {
  color: red
}
</style>
