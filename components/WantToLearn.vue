<template>
  <div>
    <div id="wantToLearn" class="flex flex-col">
      <span>Games I want to learn...</span>
      <ul class="shelve-row">
        <GameImage
          v-for="(game, n) of myGallery"
          :key="n"
          :game="game"
          v-on:remove-game-from-dashboard="removeGameFromDashboard(game)"
          galleryType="myGallery"
        />
        <li />
      </ul>
    </div>
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
      myGalleryStore: 'wantToLearn/getGallery',
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
    localforage.getItem('wantToLearn').then((value) => {
      this.$store.dispatch('wantToLearn/initialGallery', value || [])
    })
  },

  methods: {
    removeGameFromDashboard (game) {
      const tempArray = [... this.myGallery]
      tempArray.forEach((item, index) => {
        if (item.Key === game.Key) {
          tempArray.splice(index, 1)
          this.$store.dispatch('wantToLearn/imageRemoved', tempArray)
          localforage.setItem('wantToLearn', tempArray)
          return
        }
      })
    },
  }
}
</script>

<style lang="scss">
#wantToLearn {
  color: white;
  margin-bottom: 12px;
  background: black;
}

// .shelve-row {
//   display: flex;
//   flex-flow: row wrap;
//   width: 100%;
// }

ul {
  display: flex;
  flex-wrap: wrap;
}

li {
  margin: 4px;
  height: 15vh;
  flex-grow: 1;
  position: relative;
}

li:last-child {
  // There's no science in using "10" here. In all my testing, this delivered the best results.
  flex-grow: 10;
}

img {
  max-height: 100%;
  min-width: 100%;
  object-fit: cover;
  vertical-align: bottom;
}

</style>
