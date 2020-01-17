<template>
  <div class="navigation main pt1 pb1">
    <span class="logo">Piti</span>
    <div v-if="username && $route.path != '/login'">
      {{ username }}
      <button @click="logout">Wyloguj</button>
    </div>
    <div v-if="!username && $route.path != '/login'">
      <Nuxt-link to="/users/signup">Rejestracja</Nuxt-link>
      <Nuxt-link to="/users/signin">Logowanie</Nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  computed: {
    username() {
      return this.$store.getters['auth/username']
    }
  }, 
  methods: {
    ...mapMutations({
      logout: 'auth/logout'
    })
  }
}
</script>

<style lang="scss" scoped>
  .navigation {
    width: 100%;
    position: fixed; 
    top: 0;
    left: 0;
    z-index: 1000;
  }
</style>