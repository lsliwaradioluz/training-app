<template>
  <div class="register-coach column j-center">
    <h1 class="mt0 mb2">Zarejestruj się</h1>
    <form class="column j-center mt1" @submit.prevent>
      <CustomInput 
        class="mb05"
        v-model="user.fullname" 
        placeholder="Imię i nazwisko"
        type="text"
        :spellcheck="false"></CustomInput>
      <CustomInput 
        class="mb05"
        v-model="user.email" 
        placeholder="Adres e-mail"
        type="email"
        :spellcheck="false"></CustomInput>
      <CustomInput 
        class="mb05"
        v-model="user.password" 
        placeholder="Hasło"
        type="password"
        :spellcheck="false"></CustomInput>
      <CustomInput 
        v-model="user.repeatPassword" 
        placeholder="Powtórz hasło"
        type="password"
        :spellcheck="false"></CustomInput>
      <button class="button-primary mt1 mb1" @click.prevent="register" type="button">Załóż konto</button>
      <div class="register-coach__help-buttons row j-center">
        <span class="t-faded">Masz już konto?&nbsp;</span>
        <nuxt-link to="/login">Zaloguj się</nuxt-link>
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
      user: {
        fullname: null, 
        email: null, 
        password: null, 
        repeatPassword: null, 
      },
    }
  },
  methods: {
    register() {
      if (!this.user.fullname || !this.user.email || !this.user.password || !this.user.repeatPassword) {
        this.setNotification('Wszystkie pola muszą być wypełnione');
        return
      } 

      if (this.user.password != this.user.repeatPassword) {
        this.setNotification('Podane hasła nie są takie same');
        return
      }
      
      const username = this.generateUsername(this.user.fullname);
      const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:1337/auth/local/register' : 'https://piti-backend.herokuapp.com/auth/local/register';
      this.$axios.$post(endpoint, {
        username: username, 
        fullname: this.user.fullname,
        email: this.user.email, 
        password: this.user.password,
        admin: true,
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
          this.setNotification('Nieprawidłowy login lub hasło');
        })
    },
    ...mapMutations({
      setUser: 'auth/setUser',
      setNotification: 'main/setNotification',
    })
  }, 
}
</script>

<style lang="scss" scoped>

  .register-coach__help-buttons {
    font-size: 12px;
  }
</style>

