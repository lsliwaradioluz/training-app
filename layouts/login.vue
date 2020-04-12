<template>
  <div class="login-layout column j-between">
    <h3 class="logo mt0 mb1 fs-24">Piti</h3>
    <Notification />
    <Nuxt />
  </div>
</template>

<script>
export default {
  middleware: 'redirect',
}
</script>

<style lang="scss" scoped>
  
  .login-layout {
    height: 100vh;
    padding: 1rem; 
  }
</style>