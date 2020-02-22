<template>
  <div class="edituser main">
    <Head>Edytuj podopiecznego</Head>
    <UserEditor :users="users" :user="user" />
  </div>
</template>

<script>
  import UserEditor from '~/components/UserEditor';
  import mainQuery from '~/apollo/queries/users/_name/edit/main.gql';

  export default {
    components: {
      UserEditor,
    },
    asyncData(context) {
      let client = context.app.apolloProvider.defaultClient;
      return client.query({ query: mainQuery })
        .then(({ data }) => {
          const userIndex = data.users.findIndex(user => {
            return user.username == context.route.params.username;
          });
          return {
            users: data.users, 
            user: data.users[userIndex]
          }
        });
    },
  }
</script>

<style lang="scss" scoped>

</style>