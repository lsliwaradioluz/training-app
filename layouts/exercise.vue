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
    <Notification />
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
  max-width: 450px;
}

.navigation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  z-index: 2;
}

@media (min-width: 450px) {
  .exercise-layout {
    min-height: 0;
    min-width: 450px;
    max-height: 80vh;
    height: 80vh;
    overflow: scroll;
    border: 4px solid black;
    border-radius: 15px;
  }

  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
