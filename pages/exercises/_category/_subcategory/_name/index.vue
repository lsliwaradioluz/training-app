<template>
  <div>
    <Exercise :exercise="exercise" />
  </div>
</template>

<script>
import mainQuery from '~/apollo/queries/exercises/_category/_subcategory/_name/main.gql'

export default {
  asyncData(context) {
    const client = context.app.apolloProvider.defaultClient;
    const name = context.route.params.name.replace(/_/g, ' ');
    return client.query({ query: mainQuery, variables: { name: name } }) 
      .then(({ data }) => {
        return {
          exercise: data.exercises[0]
        }
      }) 
  }
}
</script>