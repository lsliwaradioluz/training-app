<template>
  <div class="timer tab row j-between">
    <div class="column j-center">
      <h3 class="m00">Odpocznij</h3>
      <p class="t-small m00">
        Następnie: 
        <span v-if="next.reps">{{ next.reps }}</span> 
        <span v-if="next.reps && next.time">x</span> 
        <span v-if="next.time">{{ next.time }}</span> 
        <span v-if="next.distance">{{ next.distance }}</span> 
        {{ next.exercise.name }}
      </p>
    </div>
    <div class="row a-center">
      <p class="m00 t-right fs-2" :class="{ 't-red': timeleft == 0 }">
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
          if (this.timeleft == 0) clearInterval(countDownInterval);
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