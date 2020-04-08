<template>
  <div class="users">
    <div v-if="!$apollo.loading">
      <div class="users__buttons row pb05 j-between">
        <button :class="{ 't-green': showActiveUsers }" type="button" @click="showActiveUsers = true">Aktywni</button>
        <button :class="{ 't-green': !showActiveUsers }" type="button" @click="showActiveUsers = false">Archiwum</button>
      </div>
      <Head>
        <div class="row j-between">
          <h3 class="m00">
            <input class="input--invisible" v-model="filter" placeholder="Szukaj użytkownika..." spellcheck="false" autocomplete="off">
          </h3>
          <button type="button" @click="inviteUserVisible = true">
            <i class="flaticon-plus ml1"></i>
          </button>
        </div>
      </Head>
      <transition-group name="animate-list" v-if="filteredUsers.length > 0">
        <UserTab v-for="user in filteredUsers" :key="user.id" :user="user" edit @transfer="userToTransfer = $event" />
      </transition-group>
      <p class="tab pt05 pb05" v-else>Brak użytkowników</p>
      <Modal :show="inviteUserVisible">
        <InviteUser @close="inviteUserVisible = false" />
      </Modal>
      <Modal :show="!!userToTransfer">
        <TransferUser :user="userToTransfer" @close="userToTransfer = null" />
      </Modal>
    </div>
    <Placeholder v-else />
  </div>
</template>

<script>
  import mainQuery from '~/apollo/queries/users/main.gql';

  export default {
    apollo: {
      user: {
        query: mainQuery, 
        variables() {
          return {
            id: this.$store.getters['auth/user'].id
          }
        },
        result ({ data, loading }) {
          if (!loading) {
            this.users = [this.$store.getters['auth/user'], ...data.user.users];
          }
        },
      }
    },
    // asyncData(context) {
    //   let client = context.app.apolloProvider.defaultClient;
    //   return client.query({ query: mainQuery, variables: { id: context.store.state.auth.user.id } })
    //     .then(({ data }) => {
    //       return {
    //         user: data.user
    //       }
    //     });
    // },
    data() {
      return {
        users: Array,
        filter: '',
        inviteUserVisible: false,
        userToTransfer: null,
        showActiveUsers: true,
      }
    },
    computed: {
      filteredUsers() {
        let filter = this.filter.toLowerCase();

        if (filter !== '') {
          return this.users.filter(user => {
            const username = user.username.toLowerCase();
            return username.includes(filter) && user.active == this.showActiveUsers || filter.includes(username) && user.active == this.showActiveUsers;
          });
        } else {
          return this.users.filter(user => user.active == this.showActiveUsers);
        }
      },
    }
  }
</script>

<style lang="scss" scoped>

  .users__buttons {
    button {
      width: 50%;
    }
  }
</style>