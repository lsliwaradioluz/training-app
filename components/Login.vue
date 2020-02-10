<template>
  <div class="signin main t-white column j-center a-center">
    <h1>Trenuj świadomie</h1>
    <p class="mb0">Realizuj swój plan z cyfrowym trenerem personalnym. Daj się poprowadzić ćwiczenie po ćwiczeniu.</p>
    <form class="column a-start j-center p10">
      <input class="mb05" id="username" v-model="identifier" type="text" placeholder="Email" autocomplete="on">
      <input class="mb05" id="password" v-model="password" type="password" placeholder="Hasło" autocomplete="on">
      <transition name="fade">
        <p class="t-red mb0" :key="error">{{ error }}</p>
      </transition>
      <nuxt-link class="signin__reset" to="/login/sendpassword" tag="p">Nie pamiętasz hasła?</nuxt-link>
      <button class="button--primary" @click.prevent="signIn">Zaloguj się</button>
    </form>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      identifier: '',
      password: '',
      error: ''
    }
  },
  methods: {
    signIn() {
      const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:1337/auth/local' : 'https://powerful-taiga-81942.herokuapp.com/auth/local';
      this.$axios.$post(endpoint, {
        identifier: this.identifier, 
        password: this.password
      })
        .then(res => {
          let user = {
            id: res.user.id,
            username: res.user.username, 
            fullname: res.user.fullname, 
            email: res.user.email, 
            image: res.user.image, 
            admin: res.user.admin,
          }

          this.setUser(user);
          this.$router.push({
            path: '/dashboard'
          });
        })
        .catch(err => {
          this.identifier = '';
          this.password = '';
          this.error = 'Nieprawidłowy email lub hasło';
        })
    },
    ...mapMutations({
      setUser: 'auth/setUser'
    })
  }
}
</script>

<style lang="scss" scoped>
  .signin__reset {
    font-size: 0.8rem;
  }
</style>