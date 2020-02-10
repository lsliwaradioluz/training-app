<template>
  <div class="sendpassword row j-center a-center main">
    <div class="sendpassword__form column a-start j-center">
      <h5>Resetowanie hasła</h5>
      <p>Podaj adres e-mail wykorzystany przy zakładaniu konta. Wyślemy na niego link do formularza zmiany hasła.</p>
      <input v-model="email" placeholder="Email" type="email">
      <button class="button--primary" @click="sendPassword">Wyślij</button>
    </div>
    <transition name="fade">
      <div class="sendpassword__message column a-start j-center main b-black" v-if="showMessage">
        <h5>Sprawdź swoją skrzynkę email</h5>
        <p>Na podany adres został wysłany link do formularza. Dokończ proces zmiany hasła.</p>
        <button class="button--primary" @click="$router.go(-1)">Rozumiem</button>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        email: '', 
        showMessage: false
      }
    },
    methods: {
      sendPassword() {
        this.showMessage = true;
        const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:1337/auth/forgot-password' : 'https://powerful-taiga-81942.herokuapp.com/auth/forgot-password';
        this.$axios.$post(endpoint, {
          email: this.email
        })
          .then(res => {
            this.showMessage = true;
          })
          .catch(err => {
            console.log(err.message);
          });
      }
    }
  }
</script>

<style lang="scss" scoped>
  
  .sendpassword__message {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
  }
</style>