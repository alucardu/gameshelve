<template>
  <form class="c-reportGame contact-form" @submit.prevent="sendEmail">
    <input name="game_name" v-model="game.Key" class="hidden" />
    <span @click="report = true">Report game: {{ game.Key.substr(0, game.Key.lastIndexOf(".")) }}</span>
    <div class="modal" v-if="report">
      <span>
        You can send a report to inform the admins that
        <ul>
          <li>: this image is not appropriate</li>
          <li>: the name and image do not correlate.</li>
        </ul>
      </span>
      <button class="mt-auto" type="submit">Send report, game: {{ game.Key.substr(0, game.Key.lastIndexOf(".")) }}</button>
    </div>
  </form>
</template>

<script>
import emailjs from 'emailjs-com';

export default {
  data() {
    return {
      report: false,
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
    sendEmail(e) {
      emailjs.sendForm('service_dfwr317', 'template_4no69ks', e.target, 'user_fF2Mt6e0k2OhPq2UN8uxx')
        .then(() => {
          this.$notifier.showMessage({ content: 'Your report has been send', color: 'success' })
        }, () => {
          this.$notifier.showMessage({ content: 'Something went wrong, contact the admin', color: 'warning' })
        });
    }
  }
}
</script>

<style lang="scss">
.c-reportGame {
  button {
    text-align: left;
  }

  .modal {
    @apply flex flex-col z-10 absolute inset-y-0 bg-red-600 p-4 whitespace-no-wrap;

    left: 0;

    ul {
      @apply my-4;

      li {
        @apply ml-4;
      }
    }
  }
}
</style>

