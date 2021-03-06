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
        </a>
      </div>
      <GlobalGallery v-if="showGlobalGallery" />
      <Filepond />
      <div id="someGallery">
        <MyGallery />
        <WantToLearn />
        <div class="legend" v-if="wantToLearn.length > 0 || wantToPlay.length > 0">
          <school-icon /> Can teach
          <headset-icon /> Voice is required
        </div>
      </div>
      <ExportShelve />
    </div>
  </div>
</template>

<script>
import SchoolIcon from 'vue-material-design-icons/School.vue';
import HeadsetIcon from 'vue-material-design-icons/Headset.vue';
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
  }

}
</script>

<style lang="scss">
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
  background: #000;
  color: #fff;
}

.input, .button {
  @apply w-full bg-blue-500 text-white p-4 rounded-md;
  &[disabled] {
    @apply opacity-50;
  }
}

.formError {
  @apply text-red-500;
}
</style>
