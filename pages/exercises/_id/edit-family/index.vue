<template>
  <div class="edit-family">
    <BaseHeader>Edytuj kategorię</BaseHeader>
    <FamilyEditor :family="family" />
  </div>
</template>

<script>
  import getSingleFamily from "~/apollo/queries/getSingleFamily.gql"

  export default {
    async asyncData(context) {
      const client = context.app.apolloProvider.defaultClient
      const { data } = await client
        .query({
          query: getSingleFamily,
          variables: { id: context.route.params.id },
        })
      
      return {
        family: data.family
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>