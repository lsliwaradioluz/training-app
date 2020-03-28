<template>
  <div class="signin t-white column j-center">
    <form class="column j-center" @submit.prevent>
      <input 
        class="mb05" 
        v-model="identifier" 
        type="text"
        autocomplete="on"
        placeholder="login"
        spellcheck="false">
      <span class="row">
        <input 
          class="mb05" 
          v-model="password" 
          placeholder="hasło"
          :type="revealPassword ? 'text' : 'password'"
          autocomplete="on"
          spellcheck="false">
        <button 
          class="signin__reveal-button ml05 mb05" 
          type="button" 
          @touchstart="revealPassword = true" 
          @touchend="revealPassword = false">
          <i class="flaticon-eye"></i>
        </button>
      </span>
      <button class="button--primary square mb1 fs-1" @click.prevent="signIn" type="button">Zaloguj</button>
      <p class="signin__error t-red m00 t-small t-center">{{ error }}</p>
      <!-- <div class="column a-center">
        <nuxt-link class="t-center t-small" to="forgotpassword" tag="button" type="button" append>Nie pamiętasz hasła?</nuxt-link>
      </div> -->
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
  .signin__reveal-button {
    background-color: color(inputgray);
    border-radius: 5px;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
  }
</style>

