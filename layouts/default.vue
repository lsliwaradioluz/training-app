<template>
  <div class="default b-black" :class="{ blind: loading }">
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
