<template>
  <div class="login b-black">
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
    
    div:first-child {
      height: 100vh;
      color: white;
    }
  }
</style>