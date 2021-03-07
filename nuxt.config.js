export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'gameshelve',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  googleFonts: {
    families: {
      Roboto: true,
      'Josefin+Sans': true,
      Lato: [100, 300],
      Raleway: {
        wght: [100, 400],
        ital: [100]
      },
    }
  },

  env: {
    baseUrl: 'https://gameshelve.s3.eu-central-1.amazonaws.com/',
    identityPoolId: process.env.NUXT_ENV_IDENTITY_POOL_ID || process.env.IDENTITY_POOL_ID
  },

  auth: {
    strategies: {
      google: {
        clientId: '625050273046-8nvipki8k01tvg576nd59r0ut5dl7663.apps.googleusercontent.com',
        scope: ['profile', 'email'],
        codeChallengeMethod: '',
        responseType: 'token id_token'
      },
    }
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { mode: 'client', src: '~/plugins/vuelidate' },
    { mode: 'client', src: '~/plugins/notifier.js' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/dotenv'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
