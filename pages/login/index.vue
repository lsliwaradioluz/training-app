<template>
  <div class="login">
    <h1 class="login__header">
      Zaloguj się
    </h1>
    <p class="login__caption">
      Witamy w Piti - aplikacji #1 na rynku trenerów personalnych. Może jeszcze
      nie teraz, ale w przyszłości na pewno. Zaloguj się, aby uzyskać dostęp do
      swoich danych lub
      <nuxt-link class="login__caption__register" to="register-coach"
        >załóż konto</nuxt-link
      >, jeśli jeszcze go nie masz!
    </p>
    <form class="column j-center" @submit.prevent>
      <BaseInput
        id="login"
        v-model="identifier"
        placeholder="Email lub nazwa użytkownika"
        type="text"
        :spellcheck="false"
      />
      <BaseInput
        id="login"
        v-model="password"
        placeholder="Hasło"
        type="password"
      />
      <nuxt-link class="t-right fs-12" to="forgotpassword" type="button" append>
        Zapomniałeś hasła?
      </nuxt-link>
      <button
        class="button-primary b-headers mt2 mb1"
        type="button"
        @click.prevent="signIn"
      >
        Zaloguj
      </button>
      <div class="login__help-buttons row j-center">
        <span class="t-faded">Nie masz konta?&nbsp;</span>
        <nuxt-link to="/register-coach">Zarejestruj się</nuxt-link>
      </div>
    </form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import loginMutation from "~/apollo/mutations/login.gql";

export default {
  layout: "login",
  data() {
    return {
      client: this.$apollo.getClient(),
      identifier: "lsliwa",
      revealPassword: false,
      password: "950928",
    };
  },
  methods: {
    signIn() {
      const input = {
        identifier: this.identifier.toLowerCase(),
        password: this.password,
      };

      this.client
        .mutate({
          mutation: loginMutation,
          variables: { input },
        })
        .then((res) => {
          const user = res.data.login.user;
          const token = res.data.login.token;

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
        .catch(() => {
          this.setNotification("Nieprawidłowy login lub hasło");
        });
    },
    ...mapMutations({
      setUser: "auth/setUser",
      logout: "auth/logout",
      setNotification: "main/setNotification",
    }),
  },
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login__header {
  margin: 0;
}

.login__caption {
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

.login__caption__register {
  color: color(faded);
  text-decoration: underline;
}

.login__help-buttons {
  font-size: 12px;
}
</style>
