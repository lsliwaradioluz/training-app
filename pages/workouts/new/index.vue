<template>
  <div class="create-workout">
    <LazyWrapper :loading="$apollo.loading">
      <BaseHeader>Nowy trening</BaseHeader>
      <WorkoutEditor :template="$data" />
    </LazyWrapper>
  </div>
</template>

<script>
import getAllExercises from "~/apollo/queries/getAllExercises.gql"
import getSingleUser from "~/apollo/queries/getSingleUser.gql"

export default {
  apollo: {
    exercises: {
      query: getAllExercises,
    },
    user: {
      query: getSingleUser,
      variables() {
        return {
          id: this.$route.query.id
        }
      },
    },
  },
  data() {
    return {
      exercises: Array, 
      user: Object,
      sections: [
        { name: "Rozgrzewka", complexes: [] },
        { name: "Skillwork", complexes: [] },
        { name: "Strength", complexes: [] },
        { name: "Cardio", complexes: [] },
        { name: "Mobility", complexes: [] },
      ],
      sticky: false,
      name: "",
      selectedDate: new Date().toISOString().split("T")[0],
      selectedTime: "18:00:00",
    }
  },
}
</script>
