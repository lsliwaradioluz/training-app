<template>
  <div class="dashboard">
    <UserPanel :user="user" />
    <Head>Najnowszy trening</Head>
    <Workout :workout="user.workouts[0]" v-if="user.workouts.length > 0" />
    <p class="tab mt0" v-else>
      Brak zaplanowanych treningów.
    </p>
  </div>  
</template>

<script>

import mainQuery from '~/apollo/queries/dashboard/main.gql';

export default {
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    // const today = new Date().toISOString(); 
    return client.query({ query: mainQuery, variables: { id: context.store.state.auth.user.id } })
      .then(({ data }) => {
        return {
          user: data.user, 
        }
      });
  },
}
</script>


