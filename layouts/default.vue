<template>
  <div class="default b-black">
    <Navigation />
    <nuxt />
  </div>
</template>

<script>
import Navigation from '~/components/Navigation'


export default {
  middleware: 'redirect',
  components: {
    Navigation
  },
}
</script>
