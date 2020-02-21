<template>
  <div class="workoutpanel tab p11 row a-center">
    <div class="workoutpanel__icon avatar"></div>
    <div class="column a-start pl1">
      <h3 class="m00">{{ workout.user.fullname }}</h3>
      <p class="m00 t-small" v-if="!workout.sticky">{{ workout.scheduled | getDayName }} {{ workout.scheduled | reverseDate }}</p>
      <p class="m00 t-small" v-else>Homework</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['workout']
  }
</script>

<style lang="scss" scoped>

  .workoutpanel__icon {
    background-image: url('~assets/images/weightlifting.svg');
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
  }
</style>