<template>
  <div class="createexercise">
    <Exercise :subcategories="subcategories" edit />
  </div>
</template>

<script>
  import mainQuery from '~/apollo/queries/exercises/_category/_subcategory/new/main.gql';
  
  export default {
    asyncData(context) {
      const client = context.app.apolloProvider.defaultClient;
      return client.query({ query: mainQuery }) 
        .then(({ data }) => {
          return {
            subcategories: data.subcategories,
          }
        }) 
    }
  }
</script>

