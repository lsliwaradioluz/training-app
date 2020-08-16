<template>
  <div class="login-layout">
    <button class="m10 t-faded" @click="goBack">
      <i class="flaticon-left-arrow-2" />
    </button>
    <Notification />
    <Nuxt />
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
.login-layout {
  min-height: 100vh;
  max-width: 450px;
  padding: 1rem;
  background-color: color(primary);
}

@media (min-width: 450px) {
  .login-layout {
    min-height: 0;
    min-width: 450px;
    height: 80vh;
    overflow: scroll;
    border: 4px solid black;
    border-radius: 15px;
    transform: translateX(30deg);
  }

  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
