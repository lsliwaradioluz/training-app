<template>
  <div class="editexercise">
    <ExerciseEditor :exercise="exercise" :families="families" edit />
  </div>
</template>

<script>
import getSingleExercise from "~/apollo/queries/getSingleExercise.gql"
import getAllFamilies from "~/apollo/queries/getAllFamilies.gql"

export default {
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const userId = context.store.state.auth.user.id
    const { data: familiesData } = await client.query({ query: getAllFamilies, variables: { userId } })
    const { data: exerciseData } = await client
      .query({
        query: getSingleExercise,
        variables: { id: context.route.query.exercise },
      })
    
    return {
      exercise: exerciseData.exercise,
      families: familiesData.families
    }
  },
}
</script>
