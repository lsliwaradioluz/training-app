<template>
  <div class="workout-copying row j-between a-center pl1 pb05 pr1 pt05">
    <p class="m00 fs-12">
      Kopiujesz {{ workout.user }} {{ workout.scheduled | reverseDate }}
    </p>
    <button class="t-headers" type="button" @click="stopCopyWorkout">Zakończ</button>
  </div>
</template>

<script>
  export default {
    computed: {
      workout() {
        return this.$store.state.main.workoutToCopy;
      }
    },
    methods: {
      stopCopyWorkout() {
        this.$store.commit('main/stopCopyWorkout');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .workout-copying {
    border-bottom: 1px solid color(faded);
  }
</style>

