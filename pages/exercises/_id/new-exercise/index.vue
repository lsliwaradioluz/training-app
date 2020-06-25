<template>
  <div class="new-exercise">
    <ExerciseEditor :families="families" />
  </div>
</template>

<script>
import getAllFamilies from "~/apollo/queries/getAllFamilies.gql"

export default {
  async asyncData(context) {
    const client = context.app.apolloProvider.defaultClient
    const { data } = await client.query({ query: getAllFamilies })
    
    return {
      families: data.families
    }
  },
}
</script>
