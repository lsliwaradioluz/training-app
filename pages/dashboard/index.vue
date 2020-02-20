<template>
  <div class="dashboard main">
    <UserPanel :user="user" />
    <Head>
      <template>Najbliższy trening</template>
    </Head>
    <div>
      <Workout :workout="user.workouts[0]" v-if="isWorkoutScheduled" />
      <p class="tab p11" v-else>
        Brak zaplanowanych treningów
      </p>
    </div>
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
  computed: {
    isWorkoutScheduled() {
      const today = new Date().toISOString();
      return this.user.workouts[0].scheduled > today ? true : false;
    }
  }
}
</script>

