<template>
  <div
    :class="['c-userSuggestions', { toggle: toggleView }]"
  >
    <span
      @click="toggleSuggestion()"
      class="c-userSuggestions__contact"
    >
      Contact
    </span>
    <form
      class="contact-form"
      @submit.prevent="sendEmail"
    >
      <input
        type="email"
        name="email"
        v-model="$v.email.$model"
        placeholder="your@email.address"
      />

      <span v-if="$v.email.$error">
        Enter a valid email address...
      </span>

      <textarea
        name="message"
        placeholder="Any remarks, suggestions or compliments? Send them!"
        v-model="$v.message.$model"
      />

      <span v-if="$v.message.$error">
        Your message has to be at least 12 characters long...
      </span>

      <button
        class="button"
        :disabled="$v.email.$error || $v.message.$error || $v.message.$model.length === 0 || $v.email.$model.length === 0"
      >Send suggestion</button>
    </form>
  </div>
</template>

<script>
import emailjs from 'emailjs-com';
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      message: '',
      email: '',
      toggleView: false
    }
  },

  validations: {
    message: { minLength: minLength(12) },
    email: { required, email }
  },

  methods: {
    toggleSuggestion () {
      this.toggleView = !this.toggleView
    },

    sendEmail(e) {
      emailjs.sendForm('service_dfwr317', 'template_5kuj8nm', e.target, 'user_fF2Mt6e0k2OhPq2UN8uxx')
        .then(() => {
          this.$notifier.showMessage({ content: 'Your remark/suggestion/compliment or hatemail has been send', color: 'success' })
          this.toggleSuggestion()
        }, () => {
          this.$notifier.showMessage({ content: 'Something went wrong, contact the admin', color: 'warning' })
          this.toggleSuggestion()
        });
    }
  }
}
</script>

<style lang="scss">
.toggle {
  right: 24px !important;
}

.c-userSuggestions {
  @apply bg-orange-500 flex p-4 absolute z-10 rounded-md;

  width: 1024px;
  right: calc(0px - 992px);
  top: 76px;
  transition: right 0.35s;

  @apply ease-in-out;

  &__contact {
    @apply absolute transform rotate-90 text-white cursor-pointer;

    margin-top: 120px;
    font-size: 26px;
    left: -25px;
  }

  form {
    @apply flex flex-col p-4 w-full;
  }

  input {
    @apply bg-white p-2 rounded-md mb-2;
  }

  textarea {
    @apply bg-white p-2 rounded-md mb-2;

    height: 144px;
  }
}
</style>
