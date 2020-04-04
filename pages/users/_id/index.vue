<template>
<div>
  <div class="trainee" v-if="!$apollo.loading">
    <UserPanel :user="user" />
  <!-- TRENINGI  -->
    <div>
      <Head>
        <div class="row j-between a-center">
          <h3 class="m00">Treningi</h3>
          <div>
            <nuxt-link
              class="flaticon-plus" 
              :to="{ path: '/workouts/new', query: { id: $route.params.id } }" 
              tag="i"></nuxt-link>
          </div>
        </div>
      </Head>
      <Workout v-for="workout in workouts" :key="workout.id" :workout="workout" :user="user" />
      <p class="tab" v-if="workouts.length == 0">
        Brak treningów do wyświetlenia
      </p>
    </div>
  </div>
  <Placeholder v-else />
</div>
</template>

<script>

import mainQuery from '~/apollo/queries/users/_id/main.gql';

export default {
  data() {
    return {
      user: Object, 
      workouts: Array,
    }
  },
  apollo: {
    user: {
      query: mainQuery, 
      variables() {
        return {
          id: this.$route.params.id
        }
      },
      manual: true, 
      result({ data, loading }) {
        if (!loading) {
          this.user = data.user;
          this.workouts = data.user.workouts.sort((a, b) => {
            return b.sticky - a.sticky;
          });
        }
      }
    }
  },
}
</script>