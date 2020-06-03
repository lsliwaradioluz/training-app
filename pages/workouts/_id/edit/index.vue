<template>
  <div class="editworkout">
    <LazyWrapper :loading="$apollo.loading">
      <BaseHeader>Edytuj trening</BaseHeader>
      <WorkoutEditor :template="$data" edit />
    </LazyWrapper>
  </div>
</template>

<script>
import getAllExercises from "~/apollo/queries/getAllExercises.gql"
import getSingleWorkout from "~/apollo/queries/getSingleWorkout.gql"
import getSingleUser from "~/apollo/queries/getSingleUser.gql"

export default {
  apollo: {
    exercises: {
      query: getAllExercises,
    },
    workout: {
      query: getSingleWorkout,
      variables() {
        return {
          id: this.$route.params.id,
        }
      },
      manual: true,
      result({ data, loading }) {
        if (!loading) {
          const date = new Date(data.workout.scheduled)
          const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
          const minutes = date.getMinutes() < 10 ? `${date.getMinutes()}0` : date.getMinutes()
          const dateTimeArray = data.workout.scheduled.split("T")
          this.selectedDate = dateTimeArray[0]
          this.selectedTime = `${hours}:${minutes}`
          this.id = data.workout.id
          this.sticky = data.workout.sticky
          this.name = data.workout.name
          this.sections = data.workout.sections
        }
      }
    },
    user: {
      query: getSingleUser,
      variables() {
        return {
          limit: 5,
          id: this.$route.query.user
        }
      }
    }
  },
  data() {
    return {
      exercises: Array, 
      user: Object,
      sections: Array,
      id: String, 
      sticky: Boolean,
      name: String,
      selectedDate: String,
      selectedTime: String,
    }
  }
}
</script>
