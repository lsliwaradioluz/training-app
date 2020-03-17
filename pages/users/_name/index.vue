<template>
  <div class="trainee">
    <UserPanel :user="user" />
  <!-- TRENINGI  -->
    <div>
      <Head>
        <div class="row j-between a-center">
          <h3 class="m00">Treningi</h3>
          <div>
            <!-- <nuxt-link class="flaticon-list" to="workouts" tag="i" append></nuxt-link> -->
            <nuxt-link
              class="flaticon-plus" 
              :to="{ path: '/workouts/new', query: { username: user.username } }" 
              tag="i"></nuxt-link>
          </div>
        </div>
      </Head>
      <div>
        <Workout :workout="user.homeworks[0]" v-if="user.homeworks.length > 0" />
        <Workout v-for="workout in user.workouts" :key="workout.id" :workout="workout" />
      </div>
      <p class="tab" v-if="user.workouts.length == 0 && user.homeworks.length == 0">
        Brak treningów do wyświetlenia
      </p>
    </div>
  </div>
</template>

<script>
import mainQuery from '~/apollo/queries/users/_name/main.gql';

export default {
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    return client.query({ query: mainQuery, variables: { username: context.route.params.name } })
      .then(({ data }) => {
        return {
          user: data.users[0]
        }
      });
  },
}
</script>