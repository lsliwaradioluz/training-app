<template>
  <LazyWrapper :loading="$apollo.loading">
    <div>
      <ExerciseView :exercise="exercise" />
    </div>
  </LazyWrapper>
</template>

<script>
import getSingleExercise from '~/apollo/queries/getSingleExercise.gql'

export default {
  layout: 'exercise',
  apollo: {
    exercise: {
      query: getSingleExercise,
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
  //   return client.query({ query: getSingleExercise, variables: { id: context.route.params.id } }) 
  //     .then(({ data }) => {
  //       return {
  //         exercise: data.exercise
  //       }
  //     }) 
  // },
}
</script>