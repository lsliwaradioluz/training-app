<template>
  <div class="timer pl1">
    <div class="buttons">
      <button @click="start" v-show="!countDownInterval">start</button>
      <button @click="stop" v-show="countDownInterval">stop</button>
      <button @click="reset" v-show="!countDownInterval && timeleft !== time">reset</button>
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
      mute: {
        type: Boolean, 
        default: () => false,
      }
    },
    data() {
      return {
        timeleft: this.time,
        countDownInterval: null,
      }
    },
    watch: {
      timeleft() {
        if (!this.mute) {
          if (this.timeleft == 30) {
            this.$emit('beep', 'thirty.mp3');
          } else if (this.timeleft == 20) {
            this.$emit('beep', 'twenty.mp3');
          } else if (this.timeleft == 10) {
            this.$emit('beep', 'ten.mp3');
          } else if (this.timeleft == 3) {
            this.$emit('beep', 'threetwoone.mp3');
          }
        }
      }, 
      mute() {
        if (this.sound) this.mute ? this.sound.muted = true : this.sound.muted = false;
      }
    },
    methods: {
      start() {
        this.countDownInterval = setInterval(() => {
          this.timeleft--;
          if (this.timeleft == -1) {
            this.timeleft = 0;
            clearInterval(this.countDownInterval);
            this.$emit('countdown-over');
          };
        }, 1000);
      }, 
      stop() {
        clearInterval(this.countDownInterval);
        this.countDownInterval = null;
      }, 
      reset() {
        this.timeleft = this.time;
      }
    }, 
    mounted() {
      this.start();
    },
  }
</script> 

<style lang="scss" scoped>

  .buttons {
    display: flex;
    justify-content: space-around;
    button {
      font-size: 12px;
      color: color(faded);
    }
  }

  .play-button {
    margin-right: 2px;
  }

  p {
    line-height: 1;
  }
</style>
