<template>
  <div>
    <div v-if="!$apollo.loading" class="trainee">
      <BaseHeader>{{ user.fullname }}</BaseHeader>
      <p>
        Paruj, aby wyświetlić rozpiskę wybranego treningu w połączeniu z innym.
        Kopiuj, aby móc skorzystać z wybranego treningu nawet u innego
        użytkownika.
      </p>
      <div>
        <h3 class="head row j-between a-center pr0">
          <span>Lista treningów</span>
          <nuxt-link
            class="flaticon-plus t-white"
            :to="{ path: '/workouts/new', query: { id: $route.params.id } }"
            tag="i"
          />
        </h3>
        <div class="row pb05">
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
        <p v-if="filteredWorkouts.length == 0" class="pt05 pb05">
          Brak treningów do wyświetlenia
        </p>
      </div>
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
          id: this.$route.params.id,
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
