<template>
  <div>
    <Navigation />
    <nuxt />
  </div>
</template>

<script>
import Navigation from '~/components/website/Navigation';

export default {
  middleware: 'redirect',
  components: {
    Navigation,
  }
}
</script>

