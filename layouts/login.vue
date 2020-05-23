<template>
  <div class="login-layout">
    <button class="m10 t-faded" @click="goBack">
      <i class="flaticon-left-arrow-2"></i>
    </button>
    <Notification />
    <Nuxt />
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
  
  .login-layout {
    min-height: 100vh;
    padding: 1rem; 
    background-color: color(primary);
  }

  @media (min-width: 768px) {
    .login-layout {
      max-width: 400px;
      min-height: 0;
      height: 90vh;
      overflow-y: scroll;
      overflow-x: hidden;
      margin: 5vh auto;
      border-radius: 15px;
      box-shadow: 0 0 0 5px black;
    }
  }
</style>