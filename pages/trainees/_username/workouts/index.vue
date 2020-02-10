<template>
  <div class="trainee-workouts main">
    <UserPanel :user="user" />
    <Head>
      <div class="row j-between">
        <h3 class="m00">Treningi</h3>
        <nuxt-link to="new" tag="span" append>
          <i class="flaticon-plus t-black"></i>
        </nuxt-link>
      </div>
    </Head>
    <div v-if="user.workouts.length > 0">
      <Workout v-for="workout in user.workouts" :key="workout.id" :workout="workout">
        <template v-slot:date>{{ workout.scheduled | reverseDate }}</template>
        <template v-slot:day>{{ getWeekDay(workout.scheduled) | dayName }}</template>
      </Workout>
    </div>
    <p class="t-center" v-else>
      Brak treningów do wyświetlenia
    </p>
  </div>
</template>

<script>
import mainQuery from '~/apollo/queries/trainees/_username/workouts/main.gql'

export default {
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    return client.query({ query: mainQuery, variables: { username: context.route.params.username } })
      .then(({ data }) => {
        return {
          user: data.users[0],
        }
      });
  },
}
</script>