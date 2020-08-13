<template>
  <div class="login column j-center">
    <h1 class="mt0 mb2">
      Zaloguj się
    </h1>
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
          variables: { input }
        })
        .then(res => {
          const user = res.data.login.user
          const token = res.data.login.token

          let userToSet = {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            image: user.image,
            admin: user.admin,
            active: user.active,
          }

          this.$apolloHelpers.onLogin(token, undefined, { expires: 7 })

          this.setUser(userToSet)
          this.$router.push({
            path: "/dashboard",
          })
        })
        .catch(() => {
          this.setNotification("Nieprawidłowy login lub hasło")
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
.login__help-buttons {
  font-size: 12px;
}
</style>
