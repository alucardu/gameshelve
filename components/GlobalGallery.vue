<template>
  <div>
    <img :src="baseUrl + image.Key" v-for="(image, n) of gallery" :key="n"/>
  </div>
</template>

<script>
import listImages from '~/mixins/listImages.js'
import { mapGetters } from 'vuex'

export default {
  name: 'GlobalGallery',
  mixins: [listImages ],
  data() {
    return {
      gallery: [],
      baseUrl: 'https://gamesnap.s3.eu-central-1.amazonaws.com/'
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
        console.log(this.gallery)
      }
    }
  },

  mounted() {
    this.GalleryStore.length === 0 ? this.listImages() : this.gallery = this.GalleryStore;
  }
}
</script>

<style>

</style>
