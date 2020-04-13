<template>
  <form class="reset-password column" @submit.prevent>
    <h1 class="mt0">Przypomnij hasło</h1>
    <p class="mb2">Ze względów bezpieczeńtwa, wprowadź nowe hasło dwa razy. Jeżeli chcesz sprawdzić, czy podane hasła są takie same, dotknij ikony kłódki, aby je podejrzeć.</p>
    <CustomInput 
      class="mb05"
      v-model="password"
      placeholder="Nowe hasło"
      type="password"
      autocomplete="off"></CustomInput>
    <CustomInput 
      v-model="repeatPassword"
      placeholder="Powtórz hasło"
      type="password"
      autocomplete="off"></CustomInput>
    <button class="button-primary mt1" @click="resetPassword">Resetuj hasło</button>
    <p class="reset-password__error">{{ error }}</p>
  </form>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  layout: 'login',
  data() {
    return {
      password: '', 
      repeatPassword: '',
      error: ''
    }
  }, 
  methods: {
    resetPassword() {
      if (this.password == this.repeatPassword) {
        const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:1337/auth/reset-password' : 'https://piti-backend.herokuapp.com/auth/reset-password';
        this.$axios.$post(endpoint, {
          code: this.$route.query.code,
          password: this.password, 
          passwordConfirmation: this.password 
        })
        .then(res => {
          this.$apolloHelpers.onLogin(res.jwt, undefined, { expires: 7 })
          this.setUser(res.user);
          this.$router.push({
            path: '/dashboard'
          });
        })
        .catch(err => {
          this.error = 'Coś poszło nie tak. Spróbuj jeszcze raz';
        });
      } else {
        this.error = 'Podane hasła nie są takie same'
      }
    }, 
    ...mapMutations({
      setUser: 'auth/setUser'
    })
  }
}
</script>

<style lang="scss" scoped>
  .reset-password__error {
    font-size: 11px;
    color: color(error);
    text-align: center;
  }
</style>