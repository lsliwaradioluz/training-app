<template>
  <form class="forgot-password column" @submit.prevent>
    <h1 class="mt0">Przypomnij hasło</h1>
    <p class="mb2">Podaj adres e-mail wykorzystany przy zakładaniu konta. Wyślemy na niego link do formularza zmiany hasła.</p>
    <CustomInput
      v-model="email" 
      placeholder="Adres e-mail"
      type="email"
      :spellcheck="false"></CustomInput>
    <button class="button-primary mt1" @click.prevent="sendPassword" type="button" :disabled="sending">Resetuj hasło</button>
    <p class="forgot-password__error">{{ error }}</p>
    <div class="forgot-pasword__help-buttons row j-center">
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
        const url = 'https://piti.live/login/resetpassword';
        const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:1337/auth/forgot-password' : 'https://piti-backend.herokuapp.com/auth/forgot-password';
        this.$axios.$post(endpoint, { 
          email: this.email, 
          url: url,
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
    color: color(error);
    text-align: center;
  }

  .forgot-pasword__help-buttons {
    font-size: 12px;
  }
</style>