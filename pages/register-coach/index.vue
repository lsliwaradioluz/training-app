<template>
  <div class="register-coach column j-center">
    <form class="column j-center mt1" @submit.prevent>
      <CustomInput 
        class="mb05"
        v-model="user.fullname" 
        placeholder="Imię i nazwisko" 
        icon="user-1"
        type="text"
        :spellcheck="false"></CustomInput>
      <CustomInput 
        class="mb05"
        v-model="user.email" 
        placeholder="Adres e-mail" 
        icon="email"
        type="email"
        :spellcheck="false"></CustomInput>
      <CustomInput 
        class="mb05"
        v-model="user.password" 
        placeholder="Hasło" 
        icon="lock"
        type="password"
        :spellcheck="false"></CustomInput>
      <CustomInput 
        class="mb05"
        v-model="user.repeatPassword" 
        placeholder="Powtórz hasło" 
        icon="lock"
        type="password"
        :spellcheck="false"></CustomInput>
      <button class="button--primary mt2 b-grass" @click.prevent="register" type="button">Załóż konto</button>
      <p class="register-coach__error">{{ error }}</p>
      <nuxt-link class="t-center fs-13" to="/login" type="button">Masz już konto?</nuxt-link>
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
      error: ''
    }
  },
  methods: {
    register() {
      if (this.user.password != this.user.repeatPassword) {
        this.error = 'Podane hasła nie są takie same';
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
          this.error = 'Nie można zarejestrować';
        })
    },
    ...mapMutations({
      setUser: 'auth/setUser',
    })
  }, 
}
</script>

<style lang="scss" scoped>

  .register-coach__error {
    font-size: 11px;
    color: color(error);
    text-align: center;
  }
</style>

