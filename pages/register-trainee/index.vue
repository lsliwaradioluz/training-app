<template>
  <div class="register-trainee column">
    <h1 class="mt0 mb2">
      Zarejestruj się
    </h1>
    <form class="column j-center" @submit.prevent>
      <BaseInput
        v-model="user.password"
        class="mb05"
        placeholder="Hasło"
        type="password"
        :spellcheck="false"
      />
      <BaseInput
        v-model="user.repeatPassword"
        class="mb05"
        placeholder="Powtórz hasło"
        type="password"
        :spellcheck="false"
      />
      <button
        class="button-primary mt1"
        type="button"
        @click.prevent="register"
      >
        Załóż konto
      </button>
    </form>
  </div>
</template>

<script>
import { mapMutations } from "vuex"
import registerMutation from '~/apollo/mutations/register.gql'

export default {
  layout: "login",
  data() {
    return {
      client: this.$apollo.getClient(),
      user: {
        fullname: this.$route.query.name,
        email: this.$route.query.email,
        password: null,
        repeatPassword: null,
        coach: this.$route.query.coach,
      },
    }
  },
  methods: {
    register() {
      if (this.user.password != this.user.repeatPassword) {
        this.setNotification("Podane hasła nie są takie same")
        return
      }

      const username = this.generateUsername(this.user.fullname)
      const input = {
        username,
        fullname: this.user.fullname,
        email: this.user.email,
        password: this.user.password,
        user: this.user.coach,
        admin: false,
      }

      this.client
        .mutate({
          mutation: registerMutation,
          variables: { input }
        })
        .then(res => {
          const user = res.data.register.user
          const token = res.data.register.token

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
        .catch((err) => {
          this.setNotification("Nie udało się zarejestrować. Sprawdź połączenie z Internetem")
        });
    },
    ...mapMutations({
      setUser: "auth/setUser",
      setNotification: "main/setNotification",
    }),
  },
  beforeRouteEnter(from, to, next) {
    if (from.query.email) {
      next()
    } else {
      next({ path: "/" })
    }
  },
}
</script>
