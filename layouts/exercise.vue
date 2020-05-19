<template>
  <div class="exercise-layout">
    <div class="navigation">
      <nuxt-link class="close-button flaticon-left-arrow-2 mr05" tag="button" type="button" to="/exercises"></nuxt-link>
    </div>
    <nuxt />
    <Confirm />
  </div>
</template>

<script>

export default {
  middleware: 'redirect',
}
</script>

<style lang="scss" scoped>
  .navigation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    z-index: 2;
  }
</style>
