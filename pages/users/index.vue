<template>
<div class="users">
  <div v-if="!$apollo.loading">
    <Head>
      <div class="row j-between">
        <h3 class="m00">
          <input class="input--invisible" v-model="filter" placeholder="Szukaj..." spellcheck="false" autocomplete="off">
        </h3>
        <nuxt-link to="new" append>
          <i class="flaticon-plus ml1"></i>
        </nuxt-link>
      </div>
    </Head>
    <UserTab :user="$store.state.auth.user" edit />
    <UserTab v-for="user in filteredUsers" :key="user.id" :user="user" edit />
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
    }
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
        filteredUsers = this.user.users.filter(user => {
          const username = user.username.toLowerCase();
          return username.includes(filter) || filter.includes(username);
        });
      } else {
        filteredUsers = this.user.users;
      }
      return filteredUsers;
    },
  }
}
</script>