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
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icon.png' },
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: false,
  layoutTransition: {
    name: 'page'
  },
  env: {
    endpoint: process.env.NODE_ENV == 'development' ? 'http://localhost:1337' : 'https://piti-backend.herokuapp.com'
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/styles/fonts.css',
    '~/assets/icons/final/flaticon.css',
    '~/assets/styles/general.scss',
    '~/assets/styles/buttons.scss',
    '~/assets/styles/inputs.scss',
    '~/assets/styles/text.scss',
    '~/assets/styles/other.scss',
    '~/assets/styles/layout.scss',
    '~/assets/styles/animations.scss',
    '~/assets/styles/utilities.scss',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/filters',
    '~/plugins/components',
    '~/plugins/mixins',
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
    '@nuxtjs/pwa',
  ],
  pwa: {
    meta: {
      name: 'Piti'
    }, 
    manifest: {
      name: 'Piti',
      short_name: 'Piti',
      background_color:'#B0FE76',
      orientation: 'portrait',
      theme_color: '#343F68', 
    },
  },
  apollo: {  
    clientConfigs: {
      default: {
        httpEndpoint: process.env.NODE_ENV == 'development' ? 'http://localhost:1337/graphql' : 'https://piti-backend.herokuapp.com/graphql',
      }
    }
  },
  styleResources: {
    scss: [
      '~/assets/styles/variables.scss',
    ]
  },
  /*
  ** Build configuration
  */
  build: {
    plugins: [
      new webpack.ProvidePlugin({
        '_': 'lodash'
      })
    ],
    extend (config, ctx) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      })
    }
  }
}