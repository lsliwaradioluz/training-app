<template>
  <div class="timer pl1">
    <p class="m00 t-right fs-2 t-green" :class="{ 't-red': timeleft <= 10 }">
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
      countDown() {
        this.countDownInterval = setInterval(() => {
          this.timeleft--;
          if (this.timeleft == -1) {
            this.timeleft = 0;
            clearInterval(this.countDownInterval);
            this.$emit('countdown-over');
          };
        }, 1000);
      }, 
    }, 
    mounted() {
      this.countDown();
    },
  }
</script> 
