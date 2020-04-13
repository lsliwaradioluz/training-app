<template>
  <div class="workouts">
    <div v-if="!$apollo.loading">
      <p>Poniżej znajduje się lista wszystkich Twoich treningów. Znajdziesz wśród nich zarówno regularne treningi, jak i zadania domowe do wykonywania w dni nietreningowe lub zgodnie z zaleceniami trenera.</p>
      <h3 class="head">Lista treningów</h3>
      <div class="row mb1">
        <button class="button-switch" :class="{ 'button-switch--active': !showHomeworks }" type="button" @click="showHomeworks = false">Treningi</button>
        <button class="button-switch" :class="{ 'button-switch--active': showHomeworks }" type="button" @click="showHomeworks = true">Zadania domowe</button>
      </div>
      <transition-group name="animate-list">
        <Workout v-for="workout in filteredWorkouts" :key="workout.id" :workout="workout" />
      </transition-group>
      <p class="pb05 pt05 m00" v-if="filteredWorkouts.length == 0">
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
  data() {
    return {
      showHomeworks: false,
    }
  },
  computed: {
    filteredWorkouts() {
      if (this.showHomeworks) {
        return this.workouts.filter(workout => {
          return workout.sticky;
        });
      } else {
        return this.workouts.filter(workout => {
          return !workout.sticky;
        })
      }
    }
  }
}
</script>