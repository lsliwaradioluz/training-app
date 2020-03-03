<template>
  <div class="workout-pairing tab row j-between a-center mb05 pt05 pb05">
    <p class="m00 t-center t-small">
      W schowku jest dostępny trening.
    </p>
    <button class="t-small t-green" type="button" @click="stopCopyWorkout">Usuń</button>
  </div>
</template>

<script>
  export default {
    methods: {
      stopCopyWorkout() {
        this.$store.commit('main/stopCopyWorkout');
      }
    }
  }
</script>

