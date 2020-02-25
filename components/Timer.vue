<template>
  <div class="timer">
    <div class="tab row j-between m00">
      <div>
        <h3 class="m00">Odpocznij</h3>
        <span class="t-small">Następnie: {{ next.exercise.name }}</span>
      </div>
      <div class="row a-center pl1">
        <p 
          class="m00 t-right fs-2" 
          :class="{ 't-red': timeleft == 0 }">
          <span>{{ timeleft | showMinutes }}</span>
        </p>
      </div>
    </div>
    <div class="workout-assistant__image">
      <img src="https://media.giphy.com/media/SKAQ4kWov6tdC/giphy.gif" alt="exercise">
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
      width: 100%;
    }
  }
</style>