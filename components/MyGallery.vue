<template>
  <div class="flex">
    <GameImage
      v-for="(game, n) of myGallery"
      :key="n"
      :game="game"
      v-on:remove-game-from-dashboard="removeGameFromDashboard(game)"
      galleryType="myGallery"
    />
  </div>
</template>

<script>
import localforage from 'localforage';
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
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
  },

  methods: {
    removeGameFromDashboard (game) {
      const tempArray = [... this.myGallery]
      tempArray.forEach((item, index) => {
        if (item.Key === game.Key) {
          tempArray.splice(index, 1)
          this.$store.dispatch('myGallery/imageRemoved', tempArray)
          localforage.setItem('myGallery', tempArray)
          return
        }
      })
    }
  }
}
</script>

<style>

</style>
