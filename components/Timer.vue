<template>
  <div class="timer">
    <button 
      class="button flaticon-stop-1 mr05"
      :disabled="timeleft == time || countDownInterval"
      @click="reset" 
    />
    <button 
      v-show="!countDownInterval" 
      class="button button--big flaticon-movie-player-play-button" 
      :disabled="!active"
      @click="start" />
    <button 
      v-show="countDownInterval" 
      class="button button--big flaticon-pause-button" 
      :disabled="!active"
      @click="stop" />
  </div>  
</template>

<script>
export default {
  props: {
    time: {
      type: Number,
    },
    active: {
      type: Boolean, 
    }
  },
  data() {
    return {
      timeleft: this.time,
      countDownInterval: null,
    }
  },
  watch: {
    timeleft(value) {
      this.$emit('update-time', value)
      if (this.countDownInterval) {
        switch (value) {
          case 30: 
            this.$emit("beep", "thirty.mp3")
            break
          case 20: 
            this.$emit("beep", "twenty.mp3")
            break
          case 10: 
            this.$emit("beep", "ten.mp3")
            break
          case 3:
            this.$emit("beep", "threetwoone.mp3")
        }
      }
    },
    active: {
      immediate: true, 
      handler(isActive) {
        if (!isActive) {
          this.stop()
          this.reset()
        } else {
          this.start()
        }
      }
    }
  },
  methods: {
    start() {
      this.$emit('update-time', this.timeleft)
      this.countDownInterval = setInterval(() => {
        this.timeleft--
        if (this.timeleft == -1) {
          this.timeleft = 0
          clearInterval(this.countDownInterval)
          this.$emit("countdown-over")
        }
      }, 1000)
    },
    stop() {
      clearInterval(this.countDownInterval)
      this.countDownInterval = null
    },
    reset() {
      this.timeleft = this.time
    },
  },
}
</script>

<style lang="scss" scoped>

.timer {
  display: flex;
  .button {
    font-size: 18px;
  }
  .button--big {
    font-size: 32px;
  }
}

.button:disabled {
  color: color(faded);
}
</style>
