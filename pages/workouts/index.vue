<template>
  <div class="workouts main">
    <div>
      <Workout :workout="homework" v-if="homework"></Workout>
      <Workout v-for="workout in workouts" :key="workout.id" :workout="workout"></Workout>
    </div>
    <p class="t-center" v-if="workouts.length == 0 && !homework">
      Brak treningów do wyświetlenia
    </p>
  </div>
</template>

<script>
import mainQuery from '~/apollo/queries/workouts/main.gql';
export default {
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    return client.query({ query: mainQuery, variables: { id: context.store.state.auth.user.id } })
      .then(({ data }) => {
        return {
          workouts: data.users[0].workouts, 
          homework: data.users[0].homeworks[0]
        }
      });
  }
}
</script>