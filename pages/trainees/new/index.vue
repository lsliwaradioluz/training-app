<template>
  <div class="createuser main">
    <Head>Nowy podopieczny</Head>
    <UserEditor :users="users" />
  </div>
</template>

<script>
  import mainQuery from '~/apollo/queries/trainees/new/main.gql';
  import UserEditor from '~/components/UserEditor';

  export default {
    asyncData(context) {
      let client = context.app.apolloProvider.defaultClient;
      return client.query({ query: mainQuery })
        .then(({ data }) => {
          return {
            users: data.users
          }
        });
    },
    components: {
      UserEditor,
    },
  }
</script>