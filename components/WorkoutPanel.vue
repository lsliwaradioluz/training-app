<template>
  <div class="workout-panel column">
    <Header>
      <span v-if="user.admin && user.username != workout.user.username">{{ workout.user.username }}</span>
      <span v-else>Trening</span>
      <Date :date="workout.scheduled"></Date>
    </Header>
    <p>Zapoznaj się z rozpiską, przesuwając palcem w lewo lub w prawo. Skorzystaj z Cyfrowego Asystenta, który przeprowadzi Cię przez Twój trening krok po kroku. Po zakończonej sesji dodaj komentarz dla trenera.</p>
    <div class="buttons row j-between">
      <button class="button-tertiary" type="button" @click="$emit('show-assistant')">Asystent</button>
      <nuxt-link 
        class="button-tertiary mr05 ml05" 
        tag="button" 
        type="button" 
        @click.native="pairWorkout" 
        to="/users"
        v-if="user.admin && !isPairing">
        Paruj
      </nuxt-link>
      <button class="button-tertiary" type="button">Notatki</button>
    </div>
  </div>
</template>

<script>
  import Date from '~/components/Date';

  export default {
    components: { Date },
    props: ['workout'], 
    computed: {
      user() {
        return this.$store.state.auth.user;
      }, 
      isPairing() {
        return this.$store.state.main.workoutToPair;
      }
    },
    methods: {
      pairWorkout() {
        const workoutToPair = {
          id: this.workout.id,
          user: this.workout.user.username, 
          scheduled: this.workout.scheduled
        }
        this.$store.commit('main/pairWorkout', workoutToPair);
      }
    }
  }
</script>

<style lang="scss" scoped>

  .workout-panel {
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }

  .buttons {
    button {
      flex-basis: 49%;
      flex-shrink: 1;
    }
  }
</style>