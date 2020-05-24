<template>
  <div class="timer pl1">
    <div class="buttons">
      <button v-show="!countDownInterval" @click="start">
        start
      </button>
      <button v-show="countDownInterval" @click="stop">
        stop
      </button>
      <button
        v-show="!countDownInterval && timeleft !== time"
        class="reset-button"
        @click="reset"
      >
        reset
      </button>
    </div>
    <p class="m00 t-right fs-32 t-headers">
      {{ timeleft | showMinutes }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    time: {
      type: Number,
    },
  },
  data() {
    return {
      timeleft: this.time,
      countDownInterval: null,
    }
  },
  watch: {
    timeleft(value) {
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
    },
  },
  mounted() {
    this.start()
  },
  methods: {
    start() {
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
.buttons {
  display: flex;
  justify-content: space-around;
  button {
    font-size: 14px;
    color: color(faded);
  }
}

.reset-button {
  margin-left: 4px;
}

p {
  line-height: 1;
}
</style>
