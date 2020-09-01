<template>
  <div class="stopwatch">
    <div class="stopwatch__panel">
      <div v-if="stopwatchInterval == null" class="row">
        <button class="stopwatch__button flaticon-movie-player-play-button mr05" @click="startTime" />
        <button v-if="time > 0" class="stopwatch__button flaticon-stop-1" @click="resetTime" />
      </div>
      <button v-else class="stopwatch__button flaticon-pause-button" @click="stopTime" />
    </div>
    <p class="stopwatch__time">
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .5rem 0;
}

.stopwatch__button {
  text-transform: uppercase;
  font-size: 32px;
}

.stopwatch__time {
  margin: 0;
  display: flex;
  justify-content: center;
  font-size: 36px;
  line-height: 1;
}
</style>
