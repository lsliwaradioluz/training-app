
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Piti',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/styles/fonts.css',
    '~/assets/styles/general.scss',
    '~/assets/styles/colors.scss',
    '~/assets/styles/layout.scss',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/apollo',
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',

  ],
  apollo: {  
    clientConfigs: {
      default: {
        httpEndpoint: process.env.NODE_ENV == 'development' ? 'http://localhost:1337/graphql' : 'https://powerful-taiga-81942.herokuapp.com/graphql'
      }
    }
  },
  styleResources: {
    scss: [
      '~/assets/styles/general.scss',
    ]
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
