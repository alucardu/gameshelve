<template>
  <div class="c-myGallery">
    <div class="c-myGallery__shelve" v-if="myGallery.length > 0">
      <span class="c-myGallery__title">Games I would love to <span class="text-blue-400">play</span></span>
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
.c-myGallery {
  @apply text-white;

  &__shelve {
    @apply px-2 mt-3 bg-gray-900;
  }

  &__title {
    @apply text-2xl py-1 inline-block;

    font-family: 'Crimson Pro', serif;
  }

  ul {
    @apply gap-2 flex flex-wrap;
  }

  li {
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
}

</style>
