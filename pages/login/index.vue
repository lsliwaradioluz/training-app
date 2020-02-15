<template>
  <div class="signin t-white column j-center a-center">
    <form class="column j-center p10">
      <input class="mb05" id="username" v-model="identifier" type="text" placeholder="Nazwa użytkownika" autocomplete="on">
      <input class="mb05" id="password" v-model="password" type="password" placeholder="Hasło" autocomplete="on">
      <transition name="fade">
        <p class="t-red mb0 t-small t-center" :key="error">{{ error }}</p>
      </transition>
      <button class="button--primary mt1" @click.prevent="signIn">Zaloguj się</button>
    </form>
    <nuxt-link class="signin__reset" to="sendpassword" tag="p" append>Nie pamiętasz hasła?</nuxt-link>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  layout: 'login',
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

  .button--primary {
    border-radius: 5px;
  }
</style>