<template>
  <div class="flex justify-center">
    <div class="p-base">
      <div class="links">
        <a
          @click="showGlobalGallery = !showGlobalGallery"
          class="button--grey"
        >
          Show gallery
        </a>
      </div>
      <GlobalGallery
        v-if="showGlobalGallery"
        v-on:game-added="closeGlobalGallery"
      />
      <Filepond
        v-on:game-added-from-filepond="asd"
      />
      <ExportShelve />
      <div id="someGallery">
        <MyGallery />
        <WantToLearn />
        <div class="legend" v-if="wantToLearn.length > 0 || wantToPlay.length > 0">
          <span class="flex mr-3"><school-icon class="mr-1"/>Can teach</span>
          <span class="flex mr-3"><headset-icon class="mr-1"/>Voice is required</span>
          <span class="ml-auto">create your own shelve @ <a href="https://gameshelve.com">gameshelve.com</a></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SchoolIcon from 'vue-material-design-icons/School.vue';
import HeadsetIcon from 'vue-material-design-icons/Headset.vue';
import localforage from 'localforage';
import { mapGetters } from 'vuex'

export default {
  name: 'HomePage',
  components: {
    SchoolIcon,
    HeadsetIcon
  },

  data() {
    return {
      showGlobalGallery: false
    }
  },

  computed: {
    ...mapGetters({
      wantToPlay: 'myGallery/getGallery',
      wantToLearn: 'wantToLearn/getGallery',
    })
  },

  methods: {
    asd () {
      console.log('asd')
    },

    closeGlobalGallery() {
      this.showGlobalGallery = false
    }
  },

  mounted () {
    localforage.getItem('myGallery').then((value) => {
      if (!value) localforage.setItem('myGallery', [])
    })

    localforage.getItem('wantToLearn').then((value) => {
      if (!value) localforage.setItem('wantToLearn', [])
    })
  }

}
</script>

<style lang="scss">
#someGallery {
  @apply inline-block mb-4;
}

.p-base {
  width: 1024px;
}
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.legend {
  @apply bg-gray-900 text-white text-lg flex px-2 py-3;

  font-family: 'Crimson Pro', serif;
  a {
    @apply text-blue-300 underline;
  }
}

.input,
.button {
  @apply w-full bg-blue-500 text-white p-4 rounded-md;

  &[disabled] {
    @apply opacity-50;
  }
}

.formError {
  @apply text-red-500;
}
</style>
