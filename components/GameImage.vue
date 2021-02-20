<template>
  <div
    v-on:mouseover='hover = true'
    v-on:mouseleave='hover = false'
    class="c-gameImage"
  >
    <img :src="baseUrl + game.key">
    <div class="overlay" v-if="hover">
      <button @click="removeGameFromDashboard(game)">Remove</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import localforage from 'localforage';

export default {
  props: {
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
