<template>
  <div class="main">
    <Exercise :exercise="exercise" />
  </div>
</template>

<script>
import exerciseQuery from '~/apollo/queries/exercises/_category/_subcategory/_id/main.gql'

export default {
  asyncData(context) {
    const client = context.app.apolloProvider.defaultClient;
    const name = context.route.params.name.replace(/_/g, ' ');
    return client.query({ query: exerciseQuery, variables: { name: name } }) 
      .then(({ data }) => {
        return {
          exercise: data.exercises[0]
        }
      }) 
  }
}
</script>