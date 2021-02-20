<template>
  <div
    v-on:mouseover='hover = true'
    v-on:mouseleave='hover = false'
    class="c-gameImage"
  >
    <img :src="baseUrl + game.Key">
    <div class="overlay" v-if="hover">
      <button v-if="galleryType === 'myGallery'" @click="removeGameFromDashboard(game)">Remove</button>
      <button v-if="galleryType === 'globalGallery'" @click="addGametoDashboard(game)">Add</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    galleryType: {
      type: String,
      default: ''
    },
    game: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      baseUrl: process.env.baseUrl,
      hover: false,
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

  methods: {
    addGametoDashboard(game) {
      this.$emit('add-game-to-dashboard', game)
    },
    removeGameFromDashboard(game) {
      this.$emit('remove-game-from-dashboard', game)
    }
  }

}
</script>

<style>
.c-gameImage {
  position: relative;
  display: flex;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
