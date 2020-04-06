<template>
  <div class="users">
    <div v-if="!$apollo.loading">
      <Head>
        <div class="row j-between">
          <h3 class="m00">
            <input class="input--invisible" v-model="filter" placeholder="Szukaj użytkownika..." spellcheck="false" autocomplete="off">
          </h3>
          <button type="button" @click="inviteModalVisible = true">
            <i class="flaticon-plus ml1"></i>
          </button>
        </div>
      </Head>
      <UserTab v-for="user in filteredUsers" :key="user.id" :user="user" edit />
      <Modal :show="inviteModalVisible" transition="slide-to-right" @close="inviteModalVisible = false">
        <InviteUser @close="inviteModalVisible = false" />
      </Modal>
    </div>
    <Placeholder v-else />
  </div>
</template>

<script>
import InviteUser from '~/components/InviteUser';

import mainQuery from '~/apollo/queries/users/main.gql';

export default {
  components: {
    InviteUser
  },
  apollo: {
    user: {
      query: mainQuery, 
      variables() {
        return {
          id: this.$store.state.auth.user.id
        }
      },
      manual: true, 
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
      filter: '',
      inviteModalVisible: false,
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