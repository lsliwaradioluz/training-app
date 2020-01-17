<template>
  <div class="resetpassword main">
    <input v-model="password" type="password">
    <input v-model="repeatedPassword" type="password">
    <button @click="resetPassword">Resetuj hasło</button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      password: '', 
      repeatedPassword: ''
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