<template>
  <div class="login main b-black column j-center">
    <h4 class="logo t-center m00">Piti</h4>
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

  .logo {
    font-size: 3rem;
  }

  .login {
    height: 100vh;
  }
</style>