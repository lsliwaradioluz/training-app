<template>
<div class="slider">
  <transition name="fade" mode="out-in">
    <div 
      class="slider-content" 
      :key="current"
      :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)),url('${currentSlide.image}')`}">
      <h2 class="t-white mb05">{{ currentSlide.header }}</h2>
      <p class="mb0">{{ currentSlide.caption }}</p>
    </div>
  </transition>
  <div class="slider-indicators row j-between">
    <span 
      class="slider-indicator b-faded" 
      :class="{ 'indicator--active': n == current + 1 }"
      v-for="n in slides.length" :key="n"
      @click="switchSlide(n)"></span>
  </div>
</div>
</template>

<script>
export default {
  props: ['slides'], 
  data() {
    return {
      current: 0,
      slidesInterval: null,
    }
  },
  computed: {
    currentSlide() {
      return this.slides[this.current];
    }
  }, 
  methods: {
    switchSlide(n) {
      clearInterval(this.slidesInterval);
      this.current = n - 1;
    },
    runSlides() {
      this.slidesInterval = setInterval(() => {
        this.current == this.slides.length - 1 ? this.current = 0 : this.current++;
      }, 7000);
    }
  },
  mounted() {
    this.runSlides();
  }
}
</script>

<style lang="scss" scoped>
  
  .slider {
    position: relative;
    margin-left: -1rem;
    width: calc(100% + 2rem);
  }

  .slider-content {
    height: 40vh;
    background-size: cover;
    background-position: center;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .slider-indicators {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
  }

  .slider-indicator {
    display: inline-block;
    flex: 1;
    height: 2px;
  }

  .indicator--active {
    background-color: color(headers) !important;
  }
</style>