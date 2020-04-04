<template>
  <div class="login-layout b-default column j-center">
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

  .login-layout {
    height: 100vh;
    padding: 3rem 1rem; 
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: inherit;
      opacity: 0.9;
    }
  }
</style>