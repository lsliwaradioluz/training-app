<template>
  <div class="default b-black" :class="{ loading: loading }">
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
  computed: {
    loading() {
      return this.$store.state.main.loading;
    }
  }
}
</script>

<style>
</style>
