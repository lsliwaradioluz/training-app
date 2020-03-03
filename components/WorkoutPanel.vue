<template>
  <div class="workout-panel tab p11 row a-center j-between">
    <div class="column a-start">
      <h3 class="m00" v-if="!$store.state.auth.user.admin">{{ workout.scheduled | getDayName }}</h3>
      <h3 class="m00" v-else>{{ workout.user.fullname }}</h3>
      <p class="m00 t-small" v-if="!workout.sticky">{{ workout.scheduled | reverseDate }}</p>
      <p class="m00 t-small" v-else>Homework</p>
    </div>
    <p class="m00 fs-2" v-if="!$store.state.auth.user.admin">{{ workout.scheduled | getTime }}</p>
    <nuxt-link 
      class="button--primary" 
      type="button" 
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

<style lang="scss" scoped>

  .workout-panel__icon {
    background-image: url('~assets/images/weightlifting.svg');
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
  }
</style>