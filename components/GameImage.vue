<template>
  <li
    v-on:mouseover='hover = true'
    v-on:mouseleave='hover = false'
    class="c-gameImage"
  >
    <img :src="baseUrl + game.Key">
    <div class="overlay" v-if="hover">
      <button v-if="galleryType === 'myGallery'" @click="removeGameFromDashboard(game)">Remove</button>
      <button v-if="galleryType === 'globalGallery'" @click="addGametoDashboard(game)">Add</button>
    </div>
  </li>
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

<style lang="scss">
// .c-gameImage {
//   position: relative;
//   img {
//     flex: auto;
//     height: 200px;
//     margin: 0 8px 8px 0; /* Some gutter */
//   }
//   /* max-width: 20%; */
// }
.overlay {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
