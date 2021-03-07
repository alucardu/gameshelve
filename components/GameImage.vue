<template>
  <li
    v-on:mouseover='hover = true'
    v-on:mouseleave='hover = false'
    class="c-gameImage"
  >
    <img :src="baseUrl + game.Key">
    <div v-if="game.mic || game.teach" class="icon_overlay">
      <headset-icon span v-if="game.mic" />
      <school-icon span v-if="game.teach" />
    </div>
    <div class="overlay" v-if="hover">

      <delete-icon
        v-if="galleryType === 'myGallery' || galleryType === 'wantToLearn'"
        @click="removeGameFromDashboard(game)"
        title="Remove game from shelve"
      />

      <AddIconToGame
        v-on:remove-icon-from-game="removeIcon"
        v-if="galleryType === 'myGallery' || galleryType === 'wantToLearn'"
        :galleryType="galleryType" :game="game"
      />

      <div v-if="galleryType === 'globalGallery'" class="c-gameImage__add-game">
        <button @click="addGametoDashboard(game, 'myGallery')">Want to play</button>
        <button @click="addGametoDashboard(game, 'wantToLearn')">Want to learn</button>
        <ReportGame :game="game" class="mt-auto" />
      </div>
    </div>
  </li>
</template>

<script>
import { mapGetters } from 'vuex'

import SchoolIcon from 'vue-material-design-icons/School.vue';
import HeadsetIcon from 'vue-material-design-icons/Headset.vue';
import DeleteIcon from 'vue-material-design-icons/Delete.vue';

export default {
  components: {
    SchoolIcon,
    HeadsetIcon,
    DeleteIcon
  },
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
    addGametoDashboard(game, type) {
      this.$emit('add-game-to-dashboard', game, type)
    },
    removeGameFromDashboard(game) {
      this.$emit('remove-game-from-dashboard', game)
    },
    removeIcon(game, icon) {
      this.$emit('remove-icon-from-game', game, icon)
    }
  }

}
</script>

<style lang="scss">
.c-gameImage {
  @apply rounded-md overflow-hidden;

  &__add-game {
    @apply bg-black flex flex-col text-white absolute inset-0 h-full w-full bg-opacity-50 p-4 items-start;
  }
}

.overlay {
  position: absolute;
  padding: 8px;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  span {
    margin-bottom: 8px;
    cursor: pointer;
  }
}

.icon_overlay {
  position: absolute;
  padding: 8px;
  top: 0;
  right: 0;
  height: 100%;
  width: 40px;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.4);
  span {
    margin-bottom: 8px;
    cursor: pointer;
  }
}
</style>
