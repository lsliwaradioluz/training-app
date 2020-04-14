<template>
  <div class="exercise-layout">
    <Navigation />
    <nuxt />
    <Confirm />
  </div>
</template>

<script>
import Navigation from '~/components/Navigation';

export default {
  middleware: 'redirect',
  components: {
    Navigation, 
  },
}
</script>

<style lang="scss" scoped>
  .exercise-layout {
    padding-bottom: 4.5rem;
  }
</style>
