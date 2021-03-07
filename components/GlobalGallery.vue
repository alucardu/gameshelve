<template>
  <div class="c-globalGallery">
    <label class="self-center m-4 w-2/3 inline-block">
      <input
        placeholder="Name of the game..."
        class="input w-full"
        type="text"
        v-on:keyup='fetchGames($event.target.value)'
        v-model="$v.searchQuery.$model"
      />
      <span v-if="searchQuery.length > 0 && !$v.searchQuery.minLength" class="text-white">Your searchquery has to be at least 4 characters long</span><br>
      <span v-if="searchQuery.length > 0 && !$v.searchQuery.alpha" class="text-white">Searchquery can only contain alphabetical characters</span>
    </label>

    <ul class="bg-black">
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
      baseUrl: 'https://gameshelve.s3.eu-central-1.amazonaws.com/',
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
          this.$notifier.showMessage({ content: 'game already added to shelve', color: 'warning' })
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
              console.log('game already added to ' + this.returnOpositeType(type) + ' shelve')
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
        const x = [...this.GalleryStore]
        this.gallery = this.sortArray(x)
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
    },

    sortArray (gallery) {
      return gallery.sort(function(a, b) {
        var textA = a.Key.toUpperCase();
        var textB = b.Key.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
    }
  },

  mounted() {
    let x = []
    this.GalleryStore.length === 0 ? this.listImages() : x = [...this.GalleryStore];
    this.gallery = this.sortArray(x)
  },


}
</script>

<style lang="scss">
.c-globalGallery {
  @apply bg-black absolute z-10 w-full inset-0 mt-16 flex flex-col px-4;

  height: calc(100% - 64px);

  ul {
    @apply gap-2 flex flex-wrap;
  }

  .c-gameImage {
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
