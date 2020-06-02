<template>
  <div class="workouts">
    <div v-if="!$apollo.loading">
      <BaseHeader>Twoje treningi</BaseHeader>
      <p>
        Poniżej znajduje się lista wszystkich Twoich treningów. Znajdziesz wśród
        nich zarówno regularne treningi, jak i zadania domowe do wykonywania w
        dni nietreningowe lub zgodnie z zaleceniami trenera.
      </p>
      <div class="row mb1">
        <button
          class="button-switch"
          :class="{ 'button-switch--active': !showHomeworks }"
          type="button"
          @click="showHomeworks = false"
        >
          Jednorazowe
        </button>
        <button
          class="button-switch"
          :class="{ 'button-switch--active': showHomeworks }"
          type="button"
          @click="showHomeworks = true"
        >
          Wielorazowe
        </button>
      </div>
      <transition-group name="animate-list">
        <Workout
          v-for="workout in filteredWorkouts"
          :key="workout.id"
          :workout="workout"
          :user="user"
        />
      </transition-group>
      <p v-if="filteredWorkouts.length == 0" class="pb05 pt05 m00">
        Brak treningów do wyświetlenia
      </p>
    </div>
    <Placeholder v-else />
  </div>
</template>

<script>
import getSingleUser from "~/apollo/queries/getSingleUser.gql"

export default {
  apollo: {
    user: {
      query: getSingleUser,
      variables() {
        return {
          id: this.$store.state.auth.user.id,
        }
      },
    },
  },
  data() {
    return {
      user: Object,
      showHomeworks: false,
    }
  },
  computed: {
    filteredWorkouts() {
      if (this.showHomeworks) {
        return this.user.workouts.filter((workout) => {
          return workout.sticky
        })
      } else {
        return this.user.workouts.filter((workout) => {
          return !workout.sticky
        })
      }
    },
  },
}
</script>
