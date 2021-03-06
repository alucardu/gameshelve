<template>
  <div class="c-globalGallery">
    <input
      type="text"
      v-on:keyup='fetchGames($event.target.value)'
      v-model="$v.searchQuery.$model"
    />
    <span v-if="searchQuery.length > 0 && !$v.searchQuery.minLength" class="text-white">Your searchquery has to be at least 4 characters long</span>
    <span v-if="searchQuery.length > 0 && !$v.searchQuery.alpha" class="text-white">Your searchquery has to be at least 4 characters long and not contain spaces numbers or symbols</span>

    <ul>
      <GameImage
        v-for="(game, n) of gallery"
        :key="n"
        :game="game"
        v-on:add-game-to-dashboard="addGametoDashboard"
        galleryType="globalGallery"
      />
      <li />
    </ul>
  </div>
</template>

<script>
import listImages from '~/mixins/listImages.js'
import localforage from 'localforage';
import { mapGetters } from 'vuex'
import { debounce } from 'lodash';

import { required, minLength, alpha } from 'vuelidate/lib/validators'

export default {
  name: 'GlobalGallery',
  mixins: [listImages ],

  data() {
    return {
      searchQuery: '',
      gallery: [],
      filteredGallery: [],
      baseUrl: 'https://gamesnap.s3.eu-central-1.amazonaws.com/',
    }
  },

  validations: {
    searchQuery: { required, minLength: minLength(4), alpha }
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
    addGametoDashboard(...args) {
      const [game, type] = args
      this.addImageToGallery(game, type)
      this.$emit('game-added')
    },

    addImageToGallery (game, type) {
      localforage.getItem(this.returnOpositeType(type)).then((value) => {
        if (this.checkIfGameIsDuplicate(value, game)) {
          console.log('game already added to ' + this.returnOpositeType(type) + ' shelve')
        } else {
          localforage.getItem(type).then((value) => {
            let myArray = value || []

            if (!this.checkIfGameIsDuplicate(myArray, game)) {
              this.$store.dispatch(type + '/imageAdded', game)
              myArray.push({
                Key: game.Key,
                shelve: type
              })
              localforage.setItem(type, myArray)
            } else {
              console.log('game already added')
            }
            }).catch(function(err) {
              console.log(err);
            });
        }
      })
    },

    checkIfGameIsDuplicate (games, game) {
      for (const item of games) {
        if (item.Key === game.Key) return true
      }
      return false
    },

    fetchGames: debounce(function () {
      if (this.searchQuery.length <= 0) {
        this.gallery = this.GalleryStore
        return
      }

      if (this.searchQuery.length > 3) {
        this.gallery = this.GalleryStore.map((item) => item)
          .filter((item) => item.Key.toUpperCase().includes(this.searchQuery.toUpperCase()))
      }
    }, 500),

    returnOpositeType (type) {
      switch (type) {
        case 'myGallery': return 'wantToLearn'
        case 'wantToLearn': return 'myGallery'
      }
    }
  },

  mounted() {
    this.GalleryStore.length === 0 ? this.listImages() : this.gallery = this.GalleryStore;
  }
}
</script>

<style lang="scss">
input {
  background: grey;
  color: white;
}

.c-globalGallery {
  @apply bg-black absolute z-10 w-full inset-0 mt-16;

  height: calc(100% - 64px)
}
</style>
