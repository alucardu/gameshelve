<template>
  <div>
    <div id="shelve" class="flex flex-col">
      <span>Games I want to play...</span>
      <div class="shelve-row">
        <GameImage
          v-for="(game, n) of myGallery"
          :key="n"
          :game="game"
          v-on:remove-game-from-dashboard="removeGameFromDashboard(game)"
          galleryType="myGallery"
        />
      </div>
    </div>
    <button @click="toImage()">Export shelve</button><br>
    <button @click="shelveExample()">Example shelve</button>
    <div id="here-appear-theimages" />
  </div>
</template>

<script>
import localforage from 'localforage';
import { mapGetters } from 'vuex'
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

export default {
  data() {
    return {
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

  mounted() {
    localforage.getItem('myGallery').then((value) => {
      this.$store.dispatch('myGallery/initialGallery', value)
    })
  },

  methods: {
    removeGameFromDashboard (game) {
      const tempArray = [... this.myGallery]
      tempArray.forEach((item, index) => {
        if (item.Key === game.Key) {
          tempArray.splice(index, 1)
          this.$store.dispatch('myGallery/imageRemoved', tempArray)
          localforage.setItem('myGallery', tempArray)
          return
        }
      })
    },

    shelveExample() {
      let options = { "cacheBust":true }
      domtoimage.toPng(document.getElementById('shelve'), options)
        .then(dataUrl => {
          var img = new Image();
          img.src = dataUrl;
          document.getElementById('here-appear-theimages').appendChild(img)
        })
    },

    toImage() {
      let options = { "cacheBust":true }
      domtoimage.toPng(document.getElementById('shelve'), options)
        .then(blob => {
          saveAs(blob, 'my-node.png');
        });
    }
  }
}
</script>

<style lang="scss">
#shelve {
  color: white;
  margin-top: 12px;
  margin-bottom: 12px;
  background: black;
  height: 480px;
}

.shelve-row {
  display: flex;
}

</style>
