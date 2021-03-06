<template>
  <div class="flex flex-col">
    <headset-icon @click="addIcon('mic')" />
    <school-icon @click="addIcon('teach')" />
  </div>
</template>

<script>
import localforage from 'localforage';
import SchoolIcon from 'vue-material-design-icons/School.vue';
import HeadsetIcon from 'vue-material-design-icons/Headset.vue';

export default {
  components: {
    SchoolIcon,
    HeadsetIcon,
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

  methods: {
    addIcon(type) {
      localforage.getItem(this.galleryType).then((value) => {
        let wiebe = null
        value.forEach((item, index) => {
          if (item.Key === this.game.Key) {
            if (!value[index][type]) {
              value[index][type] = true
            } else {
              this.$emit('remove-icon-from-game', this.game, type)
            }
            wiebe = index
          }
        })
        localforage.setItem(this.galleryType, value)
        this.$store.dispatch(this.galleryType + '/initialGallery', value)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
span {
  margin-bottom: 8px;
}
</style>
