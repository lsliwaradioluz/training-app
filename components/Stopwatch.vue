<template>
  <div class="stopwatch row j-between a-center pb05 pt05">
    <div class="stopwatch__panel">
      <div class="row" v-if="stopwatchInterval == null">
        <button class="fs-15 mr05" @click="startTime">start</button>
        <button class="fs-15" @click="resetTime" v-if="time > 0">reset</button>
      </div>
      <button class="fs-15" @click="stopTime" v-else>stop</button>
    </div>
    <p class="m00 fs-15 row j-center">{{ time | filterStopwatchTime }}</p>
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
    font-size: inherit;
    font-weight: 600;
  }
</style>
