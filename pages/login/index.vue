<template>
  <div class="signin t-white column j-center">
    <form class="column j-center" v-if="!username" @submit.prevent>
      <p class="m00 mb1 t-center t-small">Podaj nazwę użytkownika:</p>
      <input 
        class="mb05 t-center" 
        v-model="identifier" 
        type="text"
        autocomplete="off"
        spellcheck="false">
      <button class="button--primary mt05" @click="confirmUser" type="button">Dalej</button>
      <p class="signin__error t-red mb0 mt05 t-small t-center">{{ error }}</p>
    </form>
    <form class="column j-center" @submit.prevent v-else>
      <p class="m00 t-center t-small">Podaj hasło użytkownika {{ username }}:</p>
      <input 
        class="invisible--input t-center t-small mb05" 
        v-model="password" 
        :type="revealPassword ? 'text' : 'password'"
        autocomplete="off"
        disabled>
      <Keyboard 
        @key-pressed="insertCode($event)"
        @reveal-password="revealPassword = true" 
        @hide-password="revealPassword = false" />
      <p class="signin__error t-red m00 t-small t-center">{{ error }}</p>
      <button class="button--primary m10" @click.prevent="signIn" type="button">Zaloguj się</button>
      <div class="column a-center">
        <button class="t-center t-small mb05" type="button" @click="changeUser">Nie jesteś {{ username }}?</button>
        <!-- <nuxt-link class="t-center t-small" to="forgotpassword" tag="button" type="button" append>Nie pamiętasz hasła?</nuxt-link> -->
      </div>
    </form>      
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import Keyboard from '~/components/Keyboard';
import mainQuery from '~/apollo/queries/login/main.gql'

export default {
  components: {
    Keyboard,
  },
  layout: 'login',
  data() {
    return { 
      client: this.$apollo.getClient(),
      users: null,
      revealPassword: false,
      identifier: '',
      password: '',
      error: ''
    }
  },
  computed: {
    username() {
      return this.$store.state.auth.username;
    }
  },
  methods: {
    confirmUser() {
      if (!this.users) {
        this.client.query({ query: mainQuery })
          .then(({ data }) => {
            this.users = data.users; 
            this.verifyUser();
          });
      } else {
        this.verifyUser();
      }
    },
    verifyUser() {
      const user = this.users.find(user => {
        return user.username.toLowerCase() == this.identifier.toLowerCase();
      });

      if (user) {
        this.setUsername(user.username);
        this.identifier = '';
        this.error = '';
      } else {
        this.error = 'Nie ma takiego użytkownika';
      }
    },
    changeUser() {
      this.setUsername(null);
      this.identifier = '';
      this.error = '';
    },
    insertCode(digit) {
      if (digit == 'C') {
        this.password = this.password.substring(0, this.password.length - 1);
      } else {
        this.password += digit;
      }
    },
    signIn() {
      const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:1337/auth/local' : 'https://powerful-taiga-81942.herokuapp.com/auth/local';
      this.$axios.$post(endpoint, {
        identifier: this.username, 
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
          this.error = 'Hasło nieprawidłowe';
        })
    },
    ...mapMutations({
      setUser: 'auth/setUser', 
      setUsername: 'auth/setUsername',
    })
  }
}
</script>

