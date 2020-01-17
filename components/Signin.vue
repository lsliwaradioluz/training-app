<template>
  <div class="signin main b-black t-white column j-center a-center">
    <h1>Trenuj świadomie</h1>
    <p class="mb0">Realizuj swój plan z cyfrowym trenerem personalnym. Daj się poprowadzić ćwiczenie po ćwiczeniu.</p>
    <form class="column a-start j-center p10">
      <input id="username" v-model="identifier" type="text" placeholder="Email" autocomplete="on">
      <input class="mb05" id="password" v-model="password" type="password" placeholder="Hasło" autocomplete="on">
      <nuxt-link to="/login/sendpassword" tag="p" class="signin__reset">Nie pamiętasz hasła?</nuxt-link>
      <button class="button--primary" @click.prevent="signIn">Zaloguj się</button>
    </form>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      identifier: '',
      password: '',
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
          this.setUser(res.user)
          this.$router.push({
            path: '/dashboard'
          });
        })
        .catch(err => {
          console.log(err.message);
        })
    },
    ...mapMutations({
      setUser: 'auth/setUser'
    })
  }
}
</script>

<style lang="scss" scoped>
  
  .signin {
    height: 100vh;
    overflow: hidden;
    position: relative;

    p {
      font-weight: 600;
      line-height: 1.5;
      font-size: 1rem;
    }

    h1, p, form {
      z-index: 2;
    }

    &::after, 
    &::before {
      content: "";
      position: absolute;
      background-color: color(green);
      bottom: 0;
      right: 0;
      height: 50%;
      width: 50%;
      z-index: 1;
      mask-image: url('~assets/images/blob-4.svg');
      opacity: 0.4;
      transform: scale(4);
      mask-size: 100% 100%;
    }

    &::after {
      transform: scale(4) rotate(30deg);
    }

    .signin__reset {
      font-size: 0.8rem;
    }
  }
  
</style>