<template>
  <div class="stopwatch column j-center a-center">
    <div @click="countdownInterval == null ? startCountdown() : stopCountdown()">
      <p class="m00 t-right fs-2" v-if="timeleft >= 0">
        {{ timeleft | showMinutes }}
      </p>
      <p class="column a-center m00 t-right fs-2" v-else>
        {{ time + Math.abs(timeleft) | showMinutes }}
      </p>
    </div>
    <button class="t-green t-small" type="button" v-show="countdownInterval == null" @click="resetCounddown">Resetuj</button>
  </div>
</template>

<script>
export default {
  props: ['time', ],
  data() {
    return {
      timeleft: this.time,
      countdownInterval: null,
    }
  },
  methods: {
    startCountdown() {
      this. countdownInterval = setInterval(() => {
        this.timeleft--;
      }, 1000);
    }, 
    stopCountdown() {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }, 
    resetCounddown() {
      this.timeleft = this.time;
      this.startCountdown();
    }
  }, 
  mounted() {
    this.startCountdown();
  }
}
</script>
