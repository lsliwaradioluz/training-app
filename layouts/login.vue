<template>
  <div class="login-layout b-default column j-center">
    <Notification />
    <Nuxt />
  </div>
</template>

<script>
export default {
  middleware: 'redirect',
  transition: 'fade',
}
</script>

<style lang="scss" scoped>

  .login-layout {
    height: 100vh;
    padding: 3rem 1rem; 
  }
</style>