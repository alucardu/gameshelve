<template>
  <div>
    <div id="shelve" class="flex flex-col" v-if="myGallery.length > 0">
      <span>Games I want to play...</span>
      <ul class="shelve-row">
        <GameImage
          v-for="(game, n) of myGallery"
          :key="n"
          :game="game"
          v-on:remove-game-from-dashboard="removeGameFromDashboard(game)"
          v-on:remove-icon-from-game="removeIconFromGame"
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
      this.$store.dispatch('myGallery/initialGallery', value || [])
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
    },

    removeIconFromGame(...args) {
      const [game, icon] = args
      localforage.getItem('myGallery').then((value) => {
        value.forEach((item, index) => {
          if (item.Key === game.Key) {
            value[index][icon] = false
          }
        })
        localforage.setItem('myGallery', value)
        this.$store.dispatch('myGallery/initialGallery', value)
      })
    }
  }
}
</script>

<style lang="scss">
#shelve {
  color: white;
  margin-top: 12px;
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
