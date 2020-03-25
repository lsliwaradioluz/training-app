<template>
  <div class="workout-pairing tab row j-between a-center mb05 pt05 pb05">
    <p class="m00 t-center t-small">
      Kopiujesz {{ workout.user }} {{ workout.scheduled | reverseDate }}
    </p>
    <button class="t-small t-green" type="button" @click="stopCopyWorkout">Usuń</button>
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

