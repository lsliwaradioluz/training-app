<template>
  <div class="register-coach column j-center">
    <h1 class="register-coach__header">
      Zarejestruj się
    </h1>
    <form class="column j-center mt1" @submit.prevent>
      <BaseInput
        v-model="user.fullname"
        class="mb05"
        placeholder="Imię i nazwisko"
        type="text"
        :spellcheck="false"
        autocomplete="off"
      />
      <BaseInput
        v-model="user.email"
        class="mb05"
        placeholder="Adres e-mail"
        type="email"
        :spellcheck="false"
        autocomplete="off"
      />
      <BaseInput
        v-model="user.password"
        class="mb05"
        placeholder="Hasło"
        type="password"
        :spellcheck="false"
        autocomplete="off"
      />
      <BaseInput
        v-model="user.repeatPassword"
        placeholder="Powtórz hasło"
        type="password"
        :spellcheck="false"
        autocomplete="off"
      />
      <button
        class="button-primary mt1 mb1"
        type="button"
        @click.prevent="register"
      >
        Załóż konto
      </button>
      <div class="register-coach__help-buttons row j-center">
        <span class="t-faded">Masz już konto?&nbsp;</span>
        <nuxt-link to="/login">
          Zaloguj się
        </nuxt-link>
      </div>
    </form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import registerMutation from "~/apollo/mutations/register.gql";

export default {
  layout: "login",
  data() {
    return {
      client: this.$apollo.getClient(),
      user: {
        fullname: "",
        email: "",
        password: "",
        repeatPassword: "",
      },
    };
  },
  methods: {
    register() {
      if (
        !this.user.fullname ||
        !this.user.email ||
        !this.user.password ||
        !this.user.repeatPassword
      ) {
        this.setNotification("Wszystkie pola muszą być wypełnione");
        return;
      }

      if (this.user.password != this.user.repeatPassword) {
        this.setNotification("Podane hasła nie są takie same");
        return;
      }

      const username = this.generateUsername(this.user.fullname);
      const input = {
        username,
        fullname: this.user.fullname,
        email: this.user.email,
        password: this.user.password,
        admin: true,
      };

      this.client
        .mutate({
          mutation: registerMutation,
          variables: { input },
        })
        .then((res) => {
          const user = res.data.register.user;
          const token = res.data.register.token;

          let userToSet = {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            image: user.image,
            admin: user.admin,
            active: user.active,
          };

          this.$apolloHelpers.onLogin(token, undefined, { expires: 7 });

          this.setUser(userToSet);
          this.$router.push({
            path: "/dashboard",
          });
        })
        .catch((err) => {
          this.setNotification(
            "Nie udało się zarejestrować. Sprawdź połączenie z Internetem"
          );
        });
    },
    ...mapMutations({
      setUser: "auth/setUser",
      setNotification: "main/setNotification",
    }),
  },
};
</script>

<style lang="scss" scoped>
.register-coach__help-buttons {
  font-size: 12px;
}
</style>
