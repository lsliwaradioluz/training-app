<template>
  <div class="workoutpanel tab p11 row a-center">
    <div class="workoutpanel__icon avatar"></div>
    <div class="column a-start pl1">
      <h3 class="mt05 mb0 t-green">{{ user.fullname }}</h3>
      <p class="m00 t-center">{{ workoutScheduled | getDayName }}</p>
      <p class="m00 t-center">{{ workoutScheduled | reverseDate }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['workout-scheduled', 'user']
  }
</script>

<style lang="scss" scoped>

  .workoutpanel__icon {
    height: 70px;
    width: 70px;
    background-image: url('~assets/images/weightlifting.svg');
    background-size: cover;
    flex-shrink: 0;
  }
</style>