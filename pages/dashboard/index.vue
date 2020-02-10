<template>
  <div class="dashboard main">
    <UserPanel :user="user" />
    <Head>
      <template>Najbliższy trening</template>
    </Head>
    <template v-if="user.workouts.length > 0">
      <Workout :workout="user.workouts[0]" />
    </template>
  </div>  
</template>

<script>
import mainQuery from '~/apollo/queries/dashboard/main.gql';
export default {
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    return client.query({ query: mainQuery, variables: { username: context.store.state.auth.user.username } })
      .then(({ data }) => {
        return {
          user: data.users[0], 
        }
      });
  },
}
</script>

