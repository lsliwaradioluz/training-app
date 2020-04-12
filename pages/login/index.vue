<template>
  <div class="login column j-center m00 pt0">
    <form class="column j-center mt1" @submit.prevent>
      <CustomInput 
        class="mb1"
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
      <nuxt-link class="t-right fs-12 mb1 mt1 fw-7" to="forgotpassword" type="button" append>Zapomniałeś hasła?</nuxt-link>
      <button class="button-primary" @click.prevent="signIn" type="button">Zaloguj</button>
      <p class="login__error">{{ error }}</p>
      <nuxt-link class="t-center fs-13" to="/register-coach" type="button">Nie masz konta?</nuxt-link>
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
    mounted() {
      setTimeout(() => {
        this.logout();
      }, 2000);
    }
  }
}
</script>

<style lang="scss" scoped>

  .login__error {
    font-size: 11px;
    color: color(error);
    text-align: center;
  }
</style>

