<template>
  <div class="sendpassword t-white column j-center a-center">
    <div class="sendpassword__form column j-center" @submit.prevent>
      <p class="t-center">Podaj adres e-mail wykorzystany przy zakładaniu konta. Wyślemy na niego link do formularza zmiany hasła.</p>
      <input class="mb05" v-model="email" placeholder="Email" type="email">
      <button class="button--primary mt1" @click="sendPassword" type="button">Wyślij</button>
    </div>
    <!-- <transition name="fade">
      <div class="sendpassword__message column a-start j-center b-black" v-if="showMessage">
        <h5>Sprawdź swoją skrzynkę email</h5>
        <p>Na podany adres został wysłany link do formularza. Dokończ proces zmiany hasła.</p>
        <button class="button--primary" @click="$router.go(-1)">Rozumiem</button>
      </div>
    </transition> -->
  </div>
</template>

<script>
  export default {
    layout: 'login',
    data() {
      return {
        email: '', 
        showMessage: false
      }
    },
    methods: {
      sendPassword() {
        const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:1337/auth/forgot-password' : 'https://powerful-taiga-81942.herokuapp.com/auth/forgot-password';
        this.$axios.$post(endpoint, { email: this.email })
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err.response);
          })
      }
    }
  }
</script>