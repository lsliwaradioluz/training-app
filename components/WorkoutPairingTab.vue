<template>
  <div class="workout-pairing row j-between a-cente">
    <p class="m00 t-center fs-12">
      Parujesz z {{ workout.user }} {{ workout.scheduled | reverseDate }}
    </p>
    <button class="fs-12 t-error" type="button" @click="stopPairWorkout">Zakończ</button>
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
    padding-bottom: .2rem;
    margin-bottom: .5rem;
    border-bottom: 1px solid #74B9F5;
  }
</style>
