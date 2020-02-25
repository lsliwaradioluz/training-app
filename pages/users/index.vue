<template>
  <div class="users main">
    <Head>
      <div class="row j-between">
        <h3 class="m00">Dodaj konto</h3>
        <nuxt-link to="new" tag="i" class="flaticon-plus" append></nuxt-link>
      </div>
    </Head>
    <UserTab :user="$store.state.auth.user" edit />
    <UserTab v-for="user in users" :key="user.id" :user="user" edit />
  </div>
</template>

<script>
import mainQuery from '~/apollo/queries/users/main.gql'
export default {
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    return client.query({ query: mainQuery, variables: { id: context.store.state.auth.user.id } })
      .then(({ data }) => {
        return {
          users: data.user.users
        }
      });
  }, 
}
</script>

<style lang="scss" scoped>

</style>