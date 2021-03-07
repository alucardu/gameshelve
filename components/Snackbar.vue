<template>
  <v-snackbar v-model="show" :color="color">
    {{ message }}
    <v-btn text @click="show = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      message: '',
      color: ''
    }
  },

  created () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/showMessage') {
        this.message = state.snackbar.content
        this.color = state.snackbar.color
        this.show = true
      }
    })
  }
}
</script>

<style lang="scss">
.v-snack {
  @apply text-xl;

  .success {
    background: green !important;
  }

  .warning {
    background: red !important;
  }

  .info {
    background: orange !important;
  }

  &__content {
    @apply text-xl flex items-center;

    .v-btn {
      @apply ml-auto;
    }
  }
}
</style>
