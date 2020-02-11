<template>
  <div class="login">
    <Logo />
    <Nuxt />
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
export default {
  transition: 'fade',
  components: {
    Logo
  }
}
</script>

<style lang="scss">

  .login {
    height: 100vh;
    background-image: url('~assets/images/endless-constellation.svg');
    
    div:first-child {
      height: 100vh;
      color: white;
    }
  }
</style>