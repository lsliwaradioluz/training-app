<template>
  <div class="users">
    <div v-if="!$apollo.loading">
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
      <UserTab v-for="user in filteredUsers" :key="user.id" :user="user" edit @transfer="userToTransfer = $event" />
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
            id: this.$store.state.auth.user.id
          }
        },
        result ({ data, loading }) {
          if (!loading) {
            this.users = [this.$store.state.auth.user, ...data.user.users];
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
      }
    },
    computed: {
      filteredUsers() {
        let filteredUsers = [];
        let filter = this.filter.toLowerCase();
        if (filter !== '') {
          filteredUsers = this.users.filter(user => {
            const username = user.username.toLowerCase();
            return username.includes(filter) || filter.includes(username);
          });
        } else {
          filteredUsers = this.users;
        }
        return filteredUsers;
      },
    }
  }
</script>