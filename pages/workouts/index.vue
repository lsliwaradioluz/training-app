<template>
  <div class="workouts">
    <div v-if="!$apollo.loading">
      <Workout v-for="workout in workouts" :key="workout.id" :workout="workout"></Workout>
      <p class="t-center" v-if="workouts.length == 0">
        Brak treningów do wyświetlenia
      </p>
    </div>
    <Placeholder v-else />
  </div>
</template>

<script>

import mainQuery from '~/apollo/queries/workouts/main.gql';

export default {
  apollo: {
    workouts: {
      query: mainQuery, 
      variables() {
        return {
          id: this.$store.state.auth.user.id
        }
      }, 
      manual: true, 
      result({ data, loading}) {
        if (!loading) {
          this.workouts = data.user.workouts.sort((a, b) => {
            return b.sticky - a.sticky;
          });
        }
      }
    }
  },
}
</script>