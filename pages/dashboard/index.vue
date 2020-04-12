<template>
  <div class="dashboard">
    <div v-if="!$apollo.loading">
      <p class="header">Witaj, {{ user.fullname | getName }}. Na swoim pulpicie poznasz aktualności związane z rozwojem aplikacji, a także statystyki dotyczące dotychczasowych treningów.</p>
      <h3 class="head">Aktualności</h3>
      <p>Aplikacja Piti zyskała nowy design! Ciesz się odświeżonym wyglądem, dzięki któremu nawigowanie między treningami będzie jeszcze prostsze.</p>
      <h3 class="head">Najnowszy trening</h3>
      <Workout :workout="user.workouts[0]" v-if="user.workouts.length > 0" />
      <p v-else>
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

<style lang="scss" scoped>
  
</style>


