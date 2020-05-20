<template>
  <div class="register-trainee column">
    <h1 class="mt0 mb2">Zarejestruj się</h1>
    <form class="column j-center" @submit.prevent>
      <CustomInput 
        class="mb05"
        v-model="user.password" 
        placeholder="Hasło"
        type="password"
        :spellcheck="false"></CustomInput>
      <CustomInput 
        class="mb05"
        v-model="user.repeatPassword" 
        placeholder="Powtórz hasło"
        type="password"
        :spellcheck="false"></CustomInput>
      <button class="button-primary mt1" @click.prevent="register" type="button">Załóż konto</button>
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
        this.setNotification('Podane hasła nie są takie same');
        return
      }

      const username = this.generateUsername(this.user.fullname);
      const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:1337/auth/local/register' : 'https://piti-backend.herokuapp.com/auth/local/register';
      const userObject = {
        username: username, 
        fullname: this.user.fullname,
        email: this.user.email, 
        password: this.user.password,
        user: this.user.coach,
        admin: false, 
      };

      
      this.$axios.$post(endpoint, userObject)
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
          this.setNotification('Nie można zarejestrować');
        })
    },
    ...mapMutations({
      setUser: 'auth/setUser',
      setNotification: 'main/setNotification',
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

  .register-trainee__error {
    position: absolute;
    bottom: 1rem;
    left: 0;
    width: 100%;
    margin-top: 1rem; 
    padding-top: 1rem;
  }
</style>

