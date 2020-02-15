<template>
  <div class="login b-black column j-center main">
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

<style lang="scss">

  .logo {
    font-size: 3rem;
  }

  .login {
    height: 100vh;
    
    div:first-child {
      height: 100vh;
      color: white;
    }
  }
</style>