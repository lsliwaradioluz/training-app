<template>
  <div class="trainee">
    <UserPanel :user="users[0]" />
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
        <Workout :workout="user.homeworks[0]" :user="user" v-if="user.homeworks.length > 0" />
        <Workout v-for="workout in user.workouts" :key="workout.id" :workout="workout" :user="user" />
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
  apollo: {
    users: {
      query: mainQuery,
      variables() {
        return {
          username: this.$route.params.name
        }
      },
      update(data) {
        return data.users
      },
    }
  }, 
  computed: {
    user() {
      return this.users[0];
    }
  },
  // mounted() {
  //   this.$apollo.queries.users.setOptions({
  //     pollInterval: 3000,
  //     fetchPolicy: 'cache-and-network'
  //   })
  // },
}
</script>