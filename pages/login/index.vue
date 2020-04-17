<template>
  <div class="login column j-center">
    <h1 class="mt0 mb2">Zaloguj się</h1>
    <form class="column j-center" @submit.prevent>
      <CustomInput
        v-model="identifier" 
        placeholder="Twój email"
        type="text"
        :spellcheck="false"></CustomInput>
      <CustomInput
        v-model="password"
        placeholder="Password"
        type="password"></CustomInput>
      <nuxt-link class="t-right fs-12" to="forgotpassword" type="button" append>Zapomniałeś hasła?</nuxt-link>
      <button class="button-primary b-headers mt2" @click.prevent="signIn" type="button">Zaloguj</button>
      <p class="login__error">{{ error }}</p>
      <div class="login__help-buttons row j-center">
        <span class="t-faded">Nie masz konta?&nbsp;</span>
        <nuxt-link to="/register-coach">Zarejestruj się</nuxt-link>
      </div>
    </form>      
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  layout: 'login',
  data() {
    return { 
      identifier: '',
      revealPassword: false,
      password: '',
      error: ''
    }
  },
  methods: {
    signIn() {
      const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:1337/auth/local' : 'https://piti-backend.herokuapp.com/auth/local';
      this.$axios.$post(endpoint, {
        identifier: this.identifier.toLowerCase(), 
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
            active: res.user.active,
          }

          this.$apolloHelpers.onLogin(res.jwt, undefined, { expires: 7 })

          this.setUser(user);
          this.$router.push({
            path: '/dashboard'
          });
        })
        .catch(err => {
          this.error = 'Nieprawidłowy login lub hasło';
        })
    },
    ...mapMutations({
      setUser: 'auth/setUser',
      logout: 'auth/logout',
    }),
  }
}
</script>

<style lang="scss" scoped>

  .login__error {
    font-size: 11px;
    color: color(error);
    text-align: center;
  }

  .login__help-buttons {
    font-size: 12px;
  }
</style>

