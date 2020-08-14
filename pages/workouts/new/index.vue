<template>
  <div class="create-workout">
    <LazyWrapper :loading="$apollo.loading">
      <BaseHeader>Nowy trening</BaseHeader>
      <WorkoutEditor :template="$data" />
    </LazyWrapper>
  </div>
</template>

<script>
import getAllFamilies from "~/apollo/queries/getAllFamilies.gql"
import getSingleUser from "~/apollo/queries/getSingleUser.gql"

export default {
  apollo: {
    families: {
      query: getAllFamilies,
      variables() {
        return {
          userId: this.$store.state.auth.user.id
        }
      }
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
      families: Array,
      user: Object,
      sections: [
        { name: "Rozgrzewka", complexes: [] },
        { name: "Siła", complexes: [] },
        { name: "Wytrzymałość", complexes: [] },
        { name: "Mobilność", complexes: [] },
      ],
      sticky: false,
      name: "",
      selectedDate: new Date().toISOString().split("T")[0],
      selectedTime: "18:00:00",
    }
  },
}
</script>
