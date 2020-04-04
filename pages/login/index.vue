<template>
  <div class="login tab column j-center m00 pt2">
    <h3 class="logo t-center mt0 mb1 fs-48">Piti</h3>
    <form class="column j-center mt1" @submit.prevent>
      <CustomInput 
        class="mb05"
        v-model="identifier" 
        placeholder="Użytkownik" 
        icon="user-1"
        type="text"
        :spellcheck="false"></CustomInput>
      <CustomInput 
        class="mb05"
        v-model="password"
        placeholder="Hasło" 
        icon="lock"
        type="password"></CustomInput>
      <button class="button--primary mt2 b-grass" @click.prevent="signIn" type="button">Zaloguj</button>
      <p class="login__error">{{ error }}</p>
      <div class="login__help-buttons row j-between">
        <nuxt-link to="/register-coach" type="button">Załóż konto</nuxt-link>
        <nuxt-link to="forgotpassword" type="button" append>Przypomnij hasło</nuxt-link>
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
      client: this.$apollo.getClient(),
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
    })
  }
}
</script>

<style lang="scss" scoped>

  .login__error {
    font-size: 11px;
    color: color(red);
    text-align: center;
    margin-top: 3px;
    margin-bottom: 2rem;
  }

  .login__help-buttons {
    font-size: 11px;

    a {
      opacity: 0.7;
      color: color(lightgray);
    }
  }
</style>

