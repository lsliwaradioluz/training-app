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
      bell: {
        type: Boolean, 
        default: () => false,
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
        if (!this.bell && !this.mute) {
          if (this.time > 30 && this.timeleft == 30) {
            this.playSound('30.mp3');
          } else if (this.time > 20 && this.timeleft == 20) {
            this.playSound('20.mp3');
          } else if (this.time > 20 && this.timeleft == 10) {
            this.playSound('10.mp3');
          } else if (this.timeleft == 3) {
            this.playSound('321.mp3');
          }
        } else if (this.bell && !this.mute) {
          if (this.timeleft == 1) this.playSound('bell.mp3');
        }
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
        var snd = new Audio(require(`@/assets/sounds/${soundname}`)); 
        snd.play();
      },
    }, 
    mounted() {
      this.countDown();
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