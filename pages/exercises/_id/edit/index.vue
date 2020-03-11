<template>
  <div class="editexercise">
    <Exercise :exercise="exercise" edit />
  </div>
</template>

<script>
  import mainQuery from '~/apollo/queries/exercises/_id/edit/main.gql';
  
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