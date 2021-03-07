<template>
  <form class="contact-form" @submit.prevent="sendEmail">
    <input name="game_name" v-model="game.Key" class="hidden" />
    <button type="submit">Report game</button>
  </form>
</template>

<script>
import emailjs from 'emailjs-com';

export default {
  data() {
    return {
      email: 'peter@cleanpixel.nl',
    }
  },

  props: {
    game: {
      type: Object,
      default: () => {}
    }
  },

  methods: {
    sendEmail: (e) => {
      console.log(e, e.target)
      emailjs.sendForm('service_dfwr317', 'template_4no69ks', e.target, 'user_fF2Mt6e0k2OhPq2UN8uxx')
        .then((result) => {
            console.log('SUCCESS!', result.status, result.text);
        }, (error) => {
            console.log('FAILED...', error);
        });
    }
  }
}
</script>

