<template>
  <div class="timer">
    <div class="buttons">
      <button v-show="!countDownInterval" class="button" @click="start">
        start
      </button>
      <button v-show="countDownInterval" class="button" @click="stop">
        stop
      </button>
      <button
        v-show="!countDownInterval && timeleft !== time"
        class="button reset-button"
        @click="reset"
      >
        reset
      </button>
    </div>
    <p class="time">
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
}

.button {
  font-size: 14px;
  color: color(faded);
}

.reset-button {
  margin-left: 4px;
}

.time {
  line-height: 1;
  margin: 0;
  text-align: right;
  font-size: 32px;
  color: color(headers);
}
</style>
