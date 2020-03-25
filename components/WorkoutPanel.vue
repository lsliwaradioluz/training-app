<template>
  <div class="workout-panel tab p11 row a-center j-between">
    <div class="column a-start">
      <div v-if="!$store.state.auth.user.admin">
        <h3 class="m00" v-if="workout.sticky">Podwieszony</h3>
        <h3 class="m00" v-else>{{ workout.scheduled | reverseDate }}</h3>
        <p class="m00 t-small" v-if="workout.sticky">dodano {{ workout.createdAt | reverseDate }}</p>
        <p class="m00 t-small" v-else>{{ workout.scheduled | getDayName }} {{ workout.scheduled | getTime }}</p>
      </div>
      <div v-else>
        <h3 class="m00">{{ workout.user.fullname }}</h3>
        <p class="m00 t-small" v-if="workout.sticky">Podwieszony</p>
        <p class="m00 t-small" v-else>{{ workout.scheduled | reverseDate }}</p>
      </div>
    </div>
    <button 
      class="button--primary ml1 pl1 pr1"
      type="button" 
      @click="$emit('show-assistant')"
      v-if="!$store.state.auth.user.admin">Asystent</button>
    <nuxt-link 
      class="button--primary ml1" 
      type="button" 
      tag="button"
      to="/users"
      @click.native="pairWorkout" 
      v-else>Paruj</nuxt-link>
  </div>
</template>

<script>

  export default {
    props: ['workout'], 
    data() {
      return {
        showButton: false,
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