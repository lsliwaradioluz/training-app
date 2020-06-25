<template>
  <div class="timer">
    <button 
      class="button flaticon-add-button mr05"
      :disabled="countDownInterval"
      @click="increment" 
    />
    <button 
      class="button flaticon-stop-1 mr05"
      :disabled="timeleft >= time || countDownInterval"
      @click="reset" 
    />
    <button 
      v-show="!countDownInterval" 
      class="button button--big flaticon-movie-player-play-button" 
      :disabled="playButtonDisabled"
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
      required: true,
    },
    automatic: {
      type: Boolean, 
      required: true,
    }
  },
  data() {
    return {
      timeleft: this.time,
      countDownInterval: null,
    }
  },
  computed: {
    playButtonDisabled() {
      return !this.active || this.timeleft == 0
    }
  },
  methods: {
    start() {
      this.$emit('update-time', this.timeleft)
      this.countDownInterval = setInterval(() => {
        this.timeleft--
        this.$emit('update-time', this.timeleft)
        if (this.countDownInterval) {
          switch (this.timeleft) {
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
        if (this.timeleft == -1) {
          this.timeleft = 0;
          this.$emit('update-time', this.timeleft)
          this.stop()
          if (this.automatic) {
            this.$emit("countdown-over")
          }
        }
      }, 1000)
    },
    stop() {
      clearInterval(this.countDownInterval)
      this.countDownInterval = null
    },
    reset() {
      this.timeleft = this.time
      this.$emit('update-time', this.timeleft)
    },
    increment() {
      this.timeleft++
      this.$emit('update-time', this.timeleft)
    }
  },
  mounted() {
    this.$emit('update-time', this.timeleft)
    if (this.automatic && this.active) {
      this.start()
    }
  }
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
