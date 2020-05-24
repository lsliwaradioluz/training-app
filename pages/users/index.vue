<template>
  <LazyWrapper :loading="$apollo.loading">
    <div class="users">
      <BaseHeader class="mt0 mb1 row j-between a-center">
        <span>Podopieczni</span>
        <button
          class="flaticon-plus t-white"
          @click="inviteUserVisible = true"
        />
      </BaseHeader>
      <p>
        Dotknij karty podopiecznego, by zobaczyć jego treningi. Chcesz przekazać
        podopiecznego innemu trenerowi? Transferuj! Skończyliście współpracę?
        Przenieś go do archiwum.
      </p>
      <div class="row">
        <button
          class="button-switch"
          :class="{ 'button-switch--active': showActiveUsers }"
          type="button"
          @click="showActiveUsers = true"
        >
          Aktywni
        </button>
        <button
          class="button-switch"
          :class="{ 'button-switch--active': !showActiveUsers }"
          type="button"
          @click="showActiveUsers = false"
        >
          Archiwum
        </button>
      </div>
      <BaseSearch v-model="filter" placeholder="Szukaj podopiecznego" />
      <transition-group v-if="filteredUsers.length > 0" name="animate-list">
        <UserTab
          v-for="user in filteredUsers"
          :key="user.id"
          :user="user"
          edit
          @transfer="userToTransfer = $event"
        />
      </transition-group>
      <p v-else class="pt05 pb05">
        Brak użytkowników
      </p>
      <Modal :show="inviteUserVisible">
        <InviteUser @close="inviteUserVisible = false" />
      </Modal>
      <Modal :show="!!userToTransfer">
        <TransferUser :user="userToTransfer" @close="userToTransfer = null" />
      </Modal>
    </div>
  </LazyWrapper>
</template>

<script>
import mainQuery from "~/apollo/queries/users/main.gql"

export default {
  apollo: {
    user: {
      query: mainQuery,
      variables() {
        return {
          id: this.$store.getters["auth/user"].id,
        }
      },
      result({ data, loading }) {
        if (!loading) {
          this.users = [this.$store.getters["auth/user"], ...data.user.users]
        }
      },
    },
  },
  data() {
    return {
      user: {},
      users: [],
      filter: "",
      inviteUserVisible: false,
      userToTransfer: null,
      showActiveUsers: true,
    }
  },
  computed: {
    filteredUsers() {
      let filter = this.filter.toLowerCase()

      if (filter !== "") {
        return this.users.filter((user) => {
          const username = user.username.toLowerCase()
          const fullname = user.fullname.toLowerCase()
          const conditions =
            (username.includes(filter) &&
              user.active == this.showActiveUsers) ||
            (filter.includes(username) &&
              user.active == this.showActiveUsers) ||
            (fullname.includes(filter) &&
              user.active == this.showActiveUsers) ||
            (filter.includes(fullname) && user.active == this.showActiveUsers)

          return conditions
        })
      } else {
        return this.users.filter((user) => user.active == this.showActiveUsers)
      }
    },
  },
}
</script>
