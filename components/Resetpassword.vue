<template>
  <div class="resetpassword main row a-center j-center">
    <div class="resetpassword__form column a-start j-center">
      <h5>Formularz zmiany hasła</h5>
      <p>Podaj nowe hasło. Upewnij się, że podałeś dobre, wpisując dwa razy.</p>
      <input v-model="password" type="password" placeholder="Nowe hasło">
      <input v-model="repeatedPassword" type="password" placeholder="Powtórz hasło">
      <button class="button--primary" @click="resetPassword">Resetuj hasło</button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      password: '', 
      repeatedPassword: '', 
      showMessage: false
    }
  }, 
  methods: {
    resetPassword() {
      if (this.password == this.repeatedPassword) {
        const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:1337/auth/reset-password' : 'https://powerful-taiga-81942.herokuapp.com/auth/reset-password';
        this.$axios.$post(endpoint, {
          code: this.$route.query.code,
          password: this.password, 
          passwordConfirmation: this.password 
        })
        .then(res => {
          this.setUser(res.user);
          this.$router.push({
            path: '/dashboard'
          });
        })
        .catch(err => {
          console.log(err);
        })
      }
    }, 
    ...mapMutations({
      setUser: 'auth/setUser'
    })
  }
}
</script>

<style lang="scss" scoped>

</style>