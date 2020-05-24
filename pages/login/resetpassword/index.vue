<template>
  <form class="reset-password column" @submit.prevent>
    <h1 class="mt0">
      Przypomnij hasło
    </h1>
    <p class="mb2">
      Ze względów bezpieczeńtwa, wprowadź nowe hasło dwa razy. Jeżeli chcesz
      sprawdzić, czy podane hasła są takie same, dotknij ikony kłódki, aby je
      podejrzeć.
    </p>
    <BaseInput
      v-model="password"
      class="mb05"
      placeholder="Nowe hasło"
      type="password"
      autocomplete="off"
    />
    <BaseInput
      v-model="repeatPassword"
      placeholder="Powtórz hasło"
      type="password"
      autocomplete="off"
    />
    <button class="button-primary mt1" @click="resetPassword">
      Resetuj hasło
    </button>
  </form>
</template>

<script>
import { mapMutations } from "vuex"

export default {
  layout: "login",
  data() {
    return {
      password: "",
      repeatPassword: "",
    }
  },
  methods: {
    resetPassword() {
      if (this.password == this.repeatPassword) {
        const endpoint =
          process.env.NODE_ENV == "development"
            ? "http://localhost:1337/auth/reset-password"
            : "https://piti-backend.herokuapp.com/auth/reset-password"
        this.$axios
          .$post(endpoint, {
            code: this.$route.query.code,
            password: this.password,
            passwordConfirmation: this.password,
          })
          .then((res) => {
            this.$apolloHelpers.onLogin(res.jwt, undefined, { expires: 7 })
            this.setUser(res.user)
            this.$router.push({
              path: "/dashboard",
            })
          })
          .catch(() => {
            this.setNotification("Coś poszło nie tak. Spróbuj jeszcze raz")
          })
      } else {
        this.setNotification("Podane hasła nie są takie same")
      }
    },
    ...mapMutations({
      setUser: "auth/setUser",
      setNotification: "main/setNotification",
    }),
  },
}
</script>
