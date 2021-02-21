<template>
  <div>
    <input
      type="text"
      v-on:keyup='fetchGames($event.target.value)'
    />
    <GameImage
      v-for="(game, n) of filteredGallery"
      :key="n"
      :game="game"
      v-on:add-game-to-dashboard="addGametoDashboard(game)"
      galleryType="globalGallery"
    />
  </div>
</template>

<script>
import listImages from '~/mixins/listImages.js'
import localforage from 'localforage';
import { mapGetters } from 'vuex'
import { debounce } from 'lodash';

export default {
  name: 'GlobalGallery',
  mixins: [listImages ],
  data() {
    return {
      gallery: [],
      filteredGallery: [],
      baseUrl: 'https://gamesnap.s3.eu-central-1.amazonaws.com/',
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
      }
    }
  },

  methods: {

    addGametoDashboard(game) {
      this.addImageToGallery(game)
    },

    addImageToGallery (game) {
      localforage.getItem('myGallery').then((value) => {
        let myArray = value || []

        if (!this.checkIfGameIsDuplicate(myArray, game)) {
          this.$store.dispatch('myGallery/imageAdded', game)
          myArray.push({ Key: game.Key })
          localforage.setItem('myGallery', myArray)
        } else {
          console.log('game already added')
        }
      }).catch(function(err) {
        console.log(err);
      });
    },

    checkIfGameIsDuplicate (games, game) {
      for (const item of games) {
        if (item.Key === game.Key) return true
      }
      return false
    },

    fetchGames: debounce(function (searchQuery) {
      if (searchQuery.length <= 0) {
        this.filteredGallery = []
        return
      }
      this.filteredGallery = this.gallery.map((item) => item)
        .filter((item) => item.Key.includes(searchQuery))
    }, 500)
  },

  mounted() {
    this.GalleryStore.length === 0 ? this.listImages() : this.gallery = this.GalleryStore;
  }
}
</script>

<style>
input {
  background: grey;
  color: white;
}
</style>
