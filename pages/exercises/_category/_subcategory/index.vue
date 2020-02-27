<template>
  <div class="subcategory">
    <Head>
      <div class="row j-between">
        <span>{{ subcategory.name }}</span>
        <nuxt-link class="flaticon-plus" tag="i" :to="{ path: 'new', query: { subcategoryId: subcategory.id }}" append></nuxt-link>
      </div>
    </Head>
    <ExerciseTab 
      v-for="(exercise, index) in subcategory.exercises" 
      :key="exercise.id"
      :index="index"
      :exercise="exercise"/>
  </div>
</template>

<script>
  import mainQuery from '~/apollo/queries/exercises/_category/_subcategory/main.gql'

  export default {
    asyncData(context) {
      const client = context.app.apolloProvider.defaultClient;
      const name = context.route.params.subcategory.replace(/_/g, ' ');
      return client.query({ query: mainQuery, variables: { name: name } }) 
        .then(({ data }) => {
          return {
            subcategory: data.subcategories[0]
          }
        }) 
    }
  }
</script>