<template>
  <div class="exercise-layout">
    <div class="navigation">
      <button
        class="back-button flaticon-left-arrow-2 mr05"
        type="button"
        @click="goBack"
      />
    </div>
    <nuxt />
    <Confirm />
  </div>
</template>

<script>
export default {
  middleware: "redirect",
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="scss" scoped>
.exercise-layout {
  background-color: color(primary);
  position: relative;
  height: 100vh;
}

.navigation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  z-index: 2;
}

@media (min-width: 768px) {
  .exercise-layout {
    max-width: 400px;
    min-height: 0;
    height: 90vh;
    overflow: hidden;
    margin: 5vh auto;
    border-radius: 15px;
    box-shadow: 0 0 0 5px black;
  }

  .navigation {
    max-width: 400px;
    margin: 0 auto;
  }
}
</style>
