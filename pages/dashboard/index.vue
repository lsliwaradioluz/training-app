<template>
  <div class="dashboard">
    <UserPanel :user="user" />
    <Head>Najbliższy trening</Head>
    <div>
      <Workout :workout="user.workouts[0]" v-if="user.workouts.length > 0" />
      <p class="tab p11" v-else>
        Brak zaplanowanych treningów.
      </p>
    </div>
  </div>  
</template>

<script>
import mainQuery from '~/apollo/queries/dashboard/main.gql';
export default {
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    const today = new Date().toISOString(); 
    return client.query({ query: mainQuery, variables: { username: context.store.state.auth.user.username, today: today } })
      .then(({ data }) => {
        return {
          user: data.users[0], 
        }
      });
  }
}
</script>

