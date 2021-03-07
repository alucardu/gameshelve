<template>
  <div class="c-disclaimer" v-if="showDisclaimer">
    <span>
      Gameshelve is in development so changes will be made and your data can be lost.<br>
      Although Gameshelve will do it's best to not let this happen.<br>
      Gameshelve uses the browsers localstorage to store data<br>
      Deleting cache, using different browsers and systems will impact your shelve.<br>
      Gameshelve is a community driven application, Gameshelve is not responsible for any inappropriate or copyrighted content.<br>
      Gameshelve users can report any images that are not fit for this apps intent.<br>
    </span>
    <button @click="removeDisclaimer">Close</button>
  </div>
</template>

<script>
import localforage from 'localforage';

export default {
  data() {
    return {
      showDisclaimer: null
    }
  },

  methods: {
    removeDisclaimer() {
      localforage.setItem('disclaimer', false)
      this.showDisclaimer = false
    }
  },

  mounted () {
     localforage.getItem('disclaimer').then((value => {
      if (value === false) {
        this.showDisclaimer = value
      } else {
        this.showDisclaimer = true
      }
     }))
  }
}
</script>

<style lang="scss">
.c-disclaimer {
  @apply flex bg-red-600 text-white p-4 items-center;

  button {
    @apply ml-auto p-1 bg-orange-500 rounded-md;
  }
}
</style>
