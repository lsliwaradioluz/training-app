<template>
  <div class="dashboard">
    <div v-if="!$apollo.loading">
      <UserPanel :user="user" />
      <Head>Najnowszy trening</Head>
      <Workout :workout="user.workouts[0]" v-if="user.workouts.length > 0" />
      <p class="tab mt0" v-else>
        Brak zaplanowanych treningów.
      </p>
    </div>
    <Placeholder v-else />
  </div>  
</template>

<script>

import mainQuery from '~/apollo/queries/dashboard/main.gql';

export default {
  apollo: {
    user: {
      query: mainQuery, 
      variables() {
        return {
          id: this.$store.state.auth.user.id
        }
      }
    }
  },
}
</script>


