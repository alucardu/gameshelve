<template>
  <div>
    <img :src="baseUrl + image.key" v-for="(image, n) of myGallery" :key="n"/>
  </div>
</template>

<script>
import localforage from 'localforage';
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      baseUrl: 'https://gamesnap.s3.eu-central-1.amazonaws.com/',
      myGallery: []
    }
  },

  computed: {
    ...mapGetters({
      myGalleryStore: 'myGallery/getGallery',
    })
  },

  watch: {
    myGalleryStore: {
      handler (myGalleryStore) {
        this.myGallery = myGalleryStore
      }
    }
  },

  mounted() {
    localforage.getItem('myGallery').then((value) => {
      this.$store.dispatch('myGallery/initialGallery', value)
    })
  }
}
</script>

<style>

</style>
