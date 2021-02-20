<template>
  <div class="container">
    <div>
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
      Logged user: {{ $auth.user ? $auth.user.given_name : '' }}<br>
      <Filepond />
      <MyGallery />
      <GlobalGallery v-if="showGlobalGallery" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      showGlobalGallery: false
    }
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

img {
  height: 20%;
  width: 20%;
  margin-bottom: 20px;
  float: left;
}
</style>
