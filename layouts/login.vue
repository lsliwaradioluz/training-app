<template>
  <div class="login b-black">
    <Logo />
    <Nuxt />
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
export default {
  middleware: 'redirect',
  transition: 'fade',
  components: {
    Logo
  }
}
</script>

<style lang="scss">

  .login {
    height: 100vh;
    // background-image: url('~assets/images/Endless-Constellation.svg');
    
    div:first-child {
      height: 100vh;
      color: white;
    }
  }
</style>