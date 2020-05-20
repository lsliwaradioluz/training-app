<template>
  <div class="exercise-layout">
    <div class="navigation">
      <button class="back-button flaticon-left-arrow-2 mr05" type="button" @click="goBack"></button>
    </div>
    <nuxt />
    <Confirm />
  </div>
</template>

<script>

export default {
  middleware: 'redirect',
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
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
