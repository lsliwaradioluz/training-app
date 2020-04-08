<template>
  <form class="forgot-password tab column j-center m00 pt2" @submit.prevent>
    <h3 class="logo t-center mt0 mb1 fs-48">Piti</h3>
    <p class="t-center">Podaj adres e-mail wykorzystany przy zakładaniu konta. Wyślemy na niego link do formularza zmiany hasła.</p>
    <CustomInput
      v-model="email" 
      placeholder="Adres e-mail" 
      icon="email"
      type="email"
      :spellcheck="false"></CustomInput>
    <button class="button--primary mt2 b-grass" @click.prevent="sendPassword" type="button" :disabled="sending">Resetuj hasło</button>
    <p class="forgot-password__error">{{ error }}</p>
    <div class="login__help-buttons row j-center">
      <nuxt-link to="/login" type="button">Wróć do logowania</nuxt-link>
    </div>
  </form>   
</template>

<script>
  export default {
    layout: 'login',
    data() {
      return {
        email: '',
        error: '',
        sending: false,
      }
    },
    methods: {
      sendPassword() {
        this.sending = true;
        const url = process.env.NODE_ENV == 'development' ? 'http://localhost:3000/login/resetpassword' : 'https://piti.live/login/resetpassword';
        const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:1337/auth/forgot-password' : 'https://piti-backend.herokuapp.com/auth/forgot-password';
        this.$axios.$post(endpoint, { 
          email: this.email, 
          url,
        })
          .then(res => {
            this.$store.commit('main/setNotification', 'Email z instrukcją resetowania hasła został wysłany na podany adres.');
            this.$router.go(-1);
          })
          .catch(err => {
            this.sending = false;
            this.error = 'Podany adres jest nieprawidłowy';
          })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .forgot-password__error {
    font-size: 11px;
    color: color(red);
    text-align: center;
    margin-top: 3px;
    margin-bottom: 2rem;
  }

  .login__help-buttons {
    font-size: 11px;

    a {
      opacity: 0.7;
      color: color(lightgray);
    }
  }
</style>