<template>
  <div class="workout-panel column">
    <Header>
      <span>Trening</span>
      <Date :date="workout.scheduled"></Date>
    </Header>
    <p v-if="isAdmin">Wyświetlasz trening użytkownika {{ workout.user.fullname }}. Przesuwaj palcem w lewo lub prawo, by przeglądać rozpiskę treningową.</p>
    <p v-else>Przesuwaj palcem w lewo lub prawo, by przeglądać rozpiskę treningową. Nie wiesz, jak wygląda ćwiczenie? Dotknij jego nazwy, by wyświetlić szczegóły.</p>
    <div class="buttons row j-between">
      <button class="button-tertiary" type="button" @click="$emit('show-assistant')">Asystent</button>
      <nuxt-link 
        class="button-tertiary mr05 ml05" 
        tag="button" 
        type="button" 
        @click.native="pairWorkout" 
        to="/users">
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
      isAdmin() {
        return this.$store.state.auth.user.admin;
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