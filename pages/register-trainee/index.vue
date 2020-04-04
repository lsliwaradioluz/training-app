<template>
  <div class="register-trainee tab column j-center pt2">
    <h3 class="logo fs-40 fw-9 t-center mt0 mb1">Piti</h3>
    <form class="column j-center mt15" @submit.prevent>
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
      <p class="register-trainee__error">{{ error }}</p>
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
        fullname: this.$route.query.name, 
        email: this.$route.query.email, 
        password: null, 
        repeatPassword: null,
        coach: this.$route.query.coach 
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
        user: this.user.coach,
        admin: false, 
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
  beforeRouteEnter(from, to, next) {
    if (from.query.email) {
      next();
    } else {
      next({ path: '/' });
    }
  } 
}
</script>

<style lang="scss" scoped>
  .register-trainee {
    z-index: 2;
  }

  .register-trainee__error {
    font-size: 11px;
    color: color(red);
    text-align: center;
    margin-top: 2px;
    margin-bottom: 2rem;
  }
</style>

