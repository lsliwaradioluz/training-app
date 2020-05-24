<template>
  <div class="transfer-user tab b-primary">
    <h3 class="t-green mt0">
      Transferuj podopiecznego
    </h3>
    <p>
      Podaj adres e-mail trenera, któremu chcesz przekazać podopiecznego. Musi
      to być adres, którego użył przy zakładaniu konta.
    </p>
    <BaseInput
      v-model="transferEmail"
      placeholder="Adres email"
      type="email"
      :show-status="false"
    />
    <div class="transfer-user__buttons mt2 row j-between t-green">
      <button
        class="button-primary"
        type="button"
        :disabled="transferInProgress"
        @click="transferUser"
      >
        Transferuj
      </button>
      <button
        class="button-primary"
        type="button"
        :disabled="transferInProgress"
        @click="$emit('close')"
      >
        Wróć
      </button>
    </div>
  </div>
</template>

<script>
import mainQuery from "~/apollo/queries/users/main.gql"
import updateUser from "~/apollo/mutations/updateUser.gql"
import getUserByEmail from "~/apollo/queries/users/getUserByEmail.gql"

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      client: this.$apollo.getClient(),
      transferEmail: null,
      transferInProgress: false,
    }
  },
  methods: {
    transferUser() {
      this.transferInProgress = true

      this.client
        .query({
          query: getUserByEmail,
          variables: { email: this.transferEmail },
        })
        .then((res) => {
          if (
            !res.data.users[0].admin ||
            res.data.users[0].id == this.$store.getters["auth/user"].id
          ) {
            this.$store.commit(
              "main/setNotification",
              "Temu użytkownikowi nie można przekazać podopiecznego."
            )
            this.transferInProgress = false
            return
          }

          const input = {
            where: {
              id: this.user.id,
            },
            data: {
              user: res.data.users[0].id,
              active: true,
            },
          }

          this.client
            .mutate({
              mutation: updateUser,
              variables: {
                input: input,
              },
              update: (cache) => {
                // read data from cache for chosen queries
                const data = cache.readQuery({
                  query: mainQuery,
                  variables: { id: this.$store.getters["auth/user"].id },
                })
                // find index of deleted item in cached user.workouts array
                const userIndex = data.user.users.findIndex(
                  (user) => user.id == this.user.id
                )
                // remove deleted item from data
                data.user.users.splice(userIndex, 1)
                //write data back to cache
                cache.writeQuery({ query: mainQuery, data: data })
              },
            })
            .then(() => {
              this.$emit("close")
              this.$store.commit(
                "main/setNotification",
                "Transfer podopiecznego zakończony sukcesem!"
              )
            })
            .catch(() => {
              this.$store.commit(
                "main/setNotification",
                "Transfer podopiecznego nie udał się."
              )
            })
        })
        .catch(() => {
          this.transferInProgress = false
          this.$store.commit(
            "main/setNotification",
            "Nie ma takiego adresu e-mail w bazie."
          )
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.transfer-user__buttons {
  button {
    width: 49%;
    &:nth-child(1) {
      border-right: 1px solid rgba(230, 230, 230, 0.08);
    }
    &:nth-child(2) {
      border-left: 1px solid rgba(230, 230, 230, 0.08);
    }
  }
}
</style>
