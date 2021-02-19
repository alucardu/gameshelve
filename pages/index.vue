<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title">
        gamesnap
      </h1>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          rel="noopener noreferrer"
          class="button--grey"
        >
          GitHub
        </a>
        <a
          @click="$auth.loginWith('google')"
          class="button--grey"
        >
          Login with Google
        </a>
        <a
          @click="$auth.logout()"
          class="button--grey"
        >
          Logout
        </a><br>
        Logged user: {{ $auth.user ? $auth.user.given_name : '' }}<br>
        <Filepond />
        <div v-for="(image, n) of images" :key="n">
          <img :src="baseUrl + image.Key" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import listImages from '~/mixins/listImages.js'
import { mapGetters } from 'vuex'

export default {
  name: 'HomePage',
  mixins: [listImages ],
  data() {
    return {
      baseUrl: 'https://gamesnap.s3.eu-central-1.amazonaws.com/',
      images: []
    }
  },

  computed: {
    ...mapGetters({
      gallery: 'gallery/getGallery',
    })
  },

  watch: {
    gallery: {
      handler (gallery) {
        this.images = gallery
      }
    }
  },

  mounted() {
    this.listImages()
  }
}
</script>

<style>
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
  align-items: center;
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
</style>
