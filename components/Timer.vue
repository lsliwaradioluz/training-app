<template>
  <div class="timer pl1">
    <p class="m00 t-right fs-2" :class="{ 't-green': timeleft <= 10 }">
      {{ timeleft | showMinutes }}
    </p>
  </div>
</template>

<script>
  export default {
    props: ['time'],
    data() {
      return {
        timeleft: this.time,
      }
    },
    methods: {
      countDown() {
        const countDownInterval = setInterval(() => {
          this.timeleft--;
          if (this.timeleft == -1) {
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