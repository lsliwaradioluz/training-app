<template>
  <div class="trainees main">
    <Head>
      <div class="row j-between">
        <h3 class="m00">Dodaj konto</h3>
        <nuxt-link to="new" tag="i" class="flaticon-plus" append></nuxt-link>
      </div>
    </Head>
    <Trainee v-for="user in users" :key="user.id" :user="user" edit />
  </div>
</template>

<script>
import usersQuery from '~/apollo/queries/trainees/main.gql'
export default {
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    return client.query({ query: usersQuery })
      .then(({ data }) => {
        return {
          users: data.users
        }
      });
  }, 
}
</script>

<style lang="scss" scoped>

</style>