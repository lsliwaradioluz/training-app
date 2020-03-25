<template>
  <div>
    <ExerciseView :exercise="exercise" />
  </div>
</template>

<script>
import mainQuery from '~/apollo/queries/exercises/_id/main.gql'

export default {
  asyncData(context) {
    const client = context.app.apolloProvider.defaultClient;
    return client.query({ query: mainQuery, variables: { id: context.route.params.id } }) 
      .then(({ data }) => {
        return {
          exercise: data.exercise
        }
      }) 
  }
}
</script>