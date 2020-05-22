<template>
  <div class="stopwatch row j-between a-center pb05 pt05">
    <div class="stopwatch__panel">
      <div class="row" v-if="stopwatchInterval == null">
        <button class="flaticon-play mr05" @click="startTime"></button>
        <button class="flaticon-stop" @click="resetTime" v-if="time > 0"></button>
      </div>
      <button class="flaticon-pause" @click="stopTime" v-else></button>
    </div>
    <p class="m00 row j-center">{{ time | filterStopwatchTime }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: 0,
      stopwatchInterval: null,
    }
  },
  methods: {
    startTime() {
      this. stopwatchInterval = setInterval(() => {
        this.time++;
      }, 10);
    }, 
    stopTime() {
      clearInterval(this.stopwatchInterval);
      this.stopwatchInterval = null;
    },
    resetTime() {
      this.stopTime();
      this.time = 0;
    }
  }
}
</script>

<style lang="scss" scoped>

  .stopwatch {
    border-bottom: 1px solid color(gray);
  }

  button {
    text-transform: uppercase;
    font-size: 14px;
  }

  p {
    line-height: 1;
    font-size: 28px;
  }
</style>
