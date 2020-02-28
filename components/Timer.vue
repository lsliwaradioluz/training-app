<template>
  <div class="timer tab row j-between">
    <div class="column j-center">
      <h3 class="m00">Za chwilę:</h3>
      <p class="t-small m00">
        <span v-if="next.reps">{{ next.reps }}</span> 
        <span v-if="next.reps && next.time">x</span> 
        <span v-if="next.time">{{ next.time }}s</span> 
        <span v-if="next.distance">{{ next.distance }}m</span> 
        <span>{{ next.exercise.name }}</span>,
        <span v-if="next.remarks">{{ next.remarks }}</span> 
      </p>
    </div>
    <div class="row a-center">
      <p class="m00 t-right fs-2" :class="{ 't-red': timeleft <= 10 }">
        {{ timeleft | showMinutes }}
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['time', 'next'],
    data() {
      return {
        timeleft: this.time,
      }
    },
    methods: {
      countDown() {
        const countDownInterval = setInterval(() => {
          this.timeleft--;
          if (this.timeleft == 0) {
            clearInterval(countDownInterval);
            this.$emit('countdown-over');
          };
        }, 1000);
      }
    }, 
    mounted() {
      this.countDown();
    }
  }
</script> 

<style lang="scss" scoped>
  .workout-assistant__image {
    img {
      border-radius: 5px;
      width: 100%;
    }
  }
</style>