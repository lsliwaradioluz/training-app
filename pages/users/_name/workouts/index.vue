<template>
  <div class="trainee-workouts">
    <Head>
      <div class="row j-between">
        <h3 class="m00">Treningi {{ user.username }}</h3>
        <nuxt-link :to="{ path: '/workouts/new', query: { username: user.username } }" tag="i" class="flaticon-plus"></nuxt-link>
      </div>
    </Head>
    <div>
      <Workout :workout="user.homeworks[0]" v-if="user.homeworks.length > 0" />
      <Workout v-for="workout in user.workouts" :key="workout.id" :workout="workout" />
    </div>
    <p class="t-center" v-if="user.workouts.length == 0 && user.homeworks.length == 0">
      Brak treningów do wyświetlenia
    </p>
  </div>
</template>

<script>
import mainQuery from '~/apollo/queries/users/_name/workouts/main.gql'

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