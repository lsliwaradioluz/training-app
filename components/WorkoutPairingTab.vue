<template>
  <div class="workout-pairing row j-between a-center pl1 pb05 pr1 pt05">
    <p class="m00 fs-12">
      Parujesz z {{ workout.user }} {{ workout.scheduled | reverseDate }}
    </p>
    <button class="t-headers" type="button" @click="stopPairWorkout">Zakończ</button>
  </div>
</template>

<script>
  export default {
    computed: {
      workout() {
        return this.$store.state.main.workoutToPair;
      }
    },
    methods: {
      stopPairWorkout() {
        this.$store.commit('main/stopPairWorkout');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .workout-pairing {
    border-bottom: 1px solid color(faded);
  }
</style>
