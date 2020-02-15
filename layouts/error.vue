<template>
  <div class="error main column a-center j-center t-center">
    <h3 class="m00 mb05 t-green">Ups! Coś poszło nie tak.</h3>
    <div class="pt05 pb0">
      <p class="m00">Kod błędu:</p>
      <p class="m00">{{ error.statusCode }}: {{ error.message }}</p>
    </div>
    <div class="pt05 pb1">
      <p class="m00">Ścieżka:</p>
      <p class="m00">{{ $route.path }}</p>
    </div>
    <nuxt-link to="/dashboard" tag="button" type="button" class="button--primary">Powrót do strony głównej</nuxt-link>
  </div>
</template>

<script>
export default {
  props: ['error']
}
</script>

<style lang="scss" scoped>
  .error {
    height: 100vh;
  }
</style>