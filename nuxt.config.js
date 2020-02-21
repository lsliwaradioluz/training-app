import webpack from 'webpack'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Piti',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=yes' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/android-chrome-192x192.png' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  layoutTransition: {
    name: 'page'
  },
  env: {
    endpoint: process.env.NODE_ENV == 'development' ? 'http://localhost:1337' : 'http://powerful-taiga-81942.herokuapp.com'
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/styles/fonts.css',
    '~/assets/styles/general.scss',
    '~/assets/styles/elements.scss',
    '~/assets/styles/colors.scss',
    '~/assets/styles/layout.scss',
    '~/assets/styles/animations.scss',
    '~/assets/icons/primary/flaticon.css',
    '~/assets/icons/final/flaticon.css',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/filters',
    '~/plugins/components',
    '~/plugins/mixins',
    '~/plugins/axios',
    '~/plugins/auth',
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
    '@nuxtjs/onesignal',
    '@nuxtjs/pwa',
  ],
  oneSignal: {
    init: {
      appId: 'training-app',
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
          disable: true
      }
    }
  },
  pwa: {
    meta: {
      theme_color: '#343F68', 
      name: 'Piti'
    }, 
    manifest: {
      name: 'Piti',
      short_name: 'Piti',
      background_color:'#B0FE76'
    },
  },
  apollo: {  
    clientConfigs: {
      default: {
        httpEndpoint: process.env.NODE_ENV == 'development' ? 'http://localhost:1337/graphql' : 'https://powerful-taiga-81942.herokuapp.com/graphql',
      }
    }
  },
  styleResources: {
    scss: [
      '~/assets/styles/general.scss',
      '~/assets/styles/elements.scss',
      '~/assets/styles/animations.scss',
    ]
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
   plugins: [
    new webpack.ProvidePlugin({
      '_': 'lodash'
    })
    ],
    extend (config, ctx) {
    }
  }
}
