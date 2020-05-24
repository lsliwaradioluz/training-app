<template>
  <div class="editexercise">
    <ExerciseEditor :exercise="exercise" edit />
  </div>
</template>

<script>
import getSingleExercise from "~/apollo/queries/getSingleExercise.gql"

export default {
  asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    return client
      .query({
        query: getSingleExercise,
        variables: { id: context.route.params.id },
      })
      .then(({ data }) => {
        return {
          exercise: data.exercise,
        }
      })
  },
}
</script>
