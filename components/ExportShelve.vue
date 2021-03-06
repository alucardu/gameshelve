<template>
  <div>
    <button @click="toImage()" class="button">Export shelve</button><br>
    <div id="here-appear-theimages" />
  </div>
</template>

<script>
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

export default {
  methods: {
    toImage() {
      let options = { "cacheBust":true }

      domtoimage.toPng(document.getElementById('someGallery'), options)
        .then(blob => {
          saveAs(blob, 'my-gameshelve.png');
        });
    }
  }
}
</script>
