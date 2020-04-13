<template>
  <div class="login-layout">
    <button class="m10 t-faded" @click="goBack">
      <i class="flaticon-left-arrow"></i>
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
  }
</style>