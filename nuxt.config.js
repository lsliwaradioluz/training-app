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
      { name: 'viewport', content: 'width=device-width, initial-scale=4' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }, 
      { name: 'mobile-web-app-capable', content: 'true' }
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
  // serverMiddleware: [
  //   'redirect-ssl'
  // ],
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
