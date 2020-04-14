<template>
  <LazyWrapper :loading="$apollo.loading">
    <div>
      <ExerciseView :exercise="exercise" />
    </div>
  </LazyWrapper>
</template>

<script>
import mainQuery from '~/apollo/queries/exercises/_id/main.gql'

export default {
  layout: 'exercise',
  apollo: {
    exercise: {
      query: mainQuery,
      variables() {
        return {
          id: this.$route.params.id,
        }
      }
    }
  },
  data() {
    return {
      exercise: {}
    }
  }
  // asyncData(context) {
  //   const client = context.app.apolloProvider.defaultClient;
  //   return client.query({ query: mainQuery, variables: { id: context.route.params.id } }) 
  //     .then(({ data }) => {
  //       return {
  //         exercise: data.exercise
  //       }
  //     }) 
  // },
}
</script>