<template>
  <div class="users">
    <Head>
      <div class="row j-between">
        <h3 class="m00">
          <input class="input--invisible" v-model="filter" placeholder="Znajdź użytkownika..." spellcheck="false" autocomplete="off">
        </h3>
        <nuxt-link class="flaticon-plus ml1" to="new" tag="i" append></nuxt-link>
      </div>
    </Head>
    <UserTab :user="$store.state.auth.user" edit />
    <UserTab v-for="user in filteredUsers" :key="user.id" :user="user" edit />
  </div>
</template>

<script>
import mainQuery from '~/apollo/queries/users/main.gql';

export default {
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    return client.query({ query: mainQuery, variables: { id: context.store.state.auth.user.id } })
      .then(({ data }) => {
        return {
          users: data.user.users
        }
      });
  },
  data() {
    return {
      filter: '',
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

<style lang="scss" scoped>

</style>