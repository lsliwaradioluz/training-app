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
        sound: null,
        timeleft: this.time,
        countDownInterval: null,
      }
    },
    watch: {
      timeleft() {
        if (!this.mute) {
          if (this.timeleft == 30) {
            this.playSound('30.mp3');
          } else if (this.timeleft == 20) {
            this.playSound('20.mp3');
          } else if (this.timeleft == 10) {
            this.playSound('10.mp3');
          } else if (this.timeleft == 3) {
            this.playSound('321.mp3');
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
      playSound(soundname) {
        this.sound = new Audio(require(`@/assets/sounds/${soundname}`)); 
        this.sound.volume = 0.3;
        this.sound.play();
      },
    }, 
    mounted() {
      this.countDown();
    }, 
    destroyed() {
      if (this.sound) this.sound.pause();
    }
  }
</script> 

<style lang="scss" scoped>
  .workout-assistant__image {
    img {
      border-radius: 5px;
      width: 100%;
    }
  }
</style>