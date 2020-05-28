<template>
  <div class="stopwatch row j-between a-center pb05 pt05">
    <div class="stopwatch__panel">
      <div v-if="stopwatchInterval == null" class="row">
        <button class="flaticon-play mr05" @click="startTime" />
        <button v-if="time > 0" class="flaticon-stop" @click="resetTime" />
      </div>
      <button v-else class="flaticon-pause" @click="stopTime" />
    </div>
    <p class="m00 row j-center">
      {{ time | filterStopwatchTime }}
    </p>
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
      this.stopwatchInterval = setInterval(() => {
        this.time++
      }, 10)
    },
    stopTime() {
      clearInterval(this.stopwatchInterval)
      this.stopwatchInterval = null
    },
    resetTime() {
      this.stopTime()
      this.time = 0
    },
  },
}
</script>

<style lang="scss" scoped>
.stopwatch {
  border-bottom: 1px solid color(gray);
  z-index: 2;
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
