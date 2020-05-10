<template>
  <div 
    class="carousel" 
    v-on="isActive && !blocked && numberOfPages > 1 ? { 
      touchstart: onTouchStart, 
      touchmove: onTouchMove, 
      touchend: onTouchEnd, 
      mousedown: onTouchStart, 
      mousemove: onTouchMove, 
      mouseup: onTouchEnd 
    } : {}">
    <div class="carousel-navdots" v-if="isActive" v-show="showNavigation && length > 1">
      <div 
        class="carousel-navdot"
        :style="[ navdotStyle, { 
          backgroundColor: n != currentPage + 1 ? 'gray' : navigationConfig.activeColor ? 
            navigationConfig.activeColor 
            : 'green'
        }]"
        v-for="n in numberOfPages" 
        v-show="numberOfPages > 1"
        :key="n"
        ref="navdot"
        @click="scrollWithNavdots(n)"></div>
    </div>
    <div 
      class="carousel-wrapper a-stretch"
      :class="{ 'inactive': !isActive || numberOfPages == 1 }"
      :style="{ transform: `translateX(${translate}px)` }"
      ref="wrapper">
        <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      active: { 
        type: Array,
        default: () => [[1, true]]
      },
      blocked: {
        type: Boolean, 
        default: () => false,
      },
      columns: { 
        type: Array,
        default: () => [[1, 1]]
      }, 
      showNavigation: {
        type: Boolean, 
        default: () => true
      },
      navigationConfig: {
        type: Object, 
        default: () => {
          return {
            borderRadius: '50%', 
            activeColor: 'green', 
            height: '10px', 
            width: '10px', 
            margin: '5px',
            fullWidth: false, 
          }
        }
      },
      sensitivity: {
        type: Number, 
        default: () => 40
      }, 
      startFromPage: {
        type: Number, 
        default: () => 0
      }, 
      autoplay: {
        type: Boolean, 
        default: () => false
      }, 
      autoplaySpeed: {
        type: Number, 
        default: () => 5
      },
    },
    data() {
      return {
        currentPage: this.startFromPage,
        numberOfColumns: 1,
        moveStart: null, 
        move: null,
        isActive: true, 
        mousedown: false,
        elementWidth: 0, 
        autoplayInterval: null, 
        animateTimeout: null,
        length: 0, 
      }
    },
    computed: {
      navdotStyle() {        
        return { 
          height: this.navigationConfig.height ? this.navigationConfig.height : '10px', 
          width: this.navigationConfig.width ? this.navigationConfig.width : '10px',
          flexBasis: this.navigationConfig.width ? this.navigationConfig.width : '5px', 
          flexGrow: this.navigationConfig.fullWidth ? 1 : 0,
          margin: this.navigationConfig.margin ? this.navigationConfig.margin : '0 5px', 
          borderRadius: this.navigationConfig.borderRadius ? this.navigationConfig.borderRadius : '50%',
          transition: 'all 0.5s',
          cursor: 'pointer',
        }
      },
      maxScrollLeft() {
        return this.currentPage == 0;
      },
      maxScrollRight() {
        // const lastElementVisible = this.currentPage + this.numberOfColumns;
        // return lastElementVisible >= this.length;
        return this.currentPage + 1 == this.numberOfPages;
      },
      numberOfPages() {
        if (this.length > this.numberOfColumns) {
          return this.length - this.numberOfColumns + 1;
        } else {
          return 1;
        }
      },
      translate() {
        return -this.elementWidth * this.currentPage
      }
    },
    watch: {
      currentPage(value) {
        this.animateCarousel();
        this.$emit('change-page', value);
      }, 
      startFromPage(value) {
        this.currentPage = value;
      },
    },
    methods: {
      animateCarousel() {
        this.$refs.wrapper.classList.add('scrolling');
        this.animateTimeout = setTimeout(() => {
          this.$refs.wrapper.classList.remove('scrolling');
        }, 500);
      },
      scrollWithNavdots(index) {
        this.currentPage = index - 1;
      },
      onTouchStart() {
        clearInterval(this.autoplayInterval);
        if (event.type == 'touchstart') {
          this.moveStart = event.touches[0].screenX
        } else {
          this.moveStart = event.screenX;
          this.mousedown = true;
        }
      },
      onTouchMove() {
        let translate;

        if (event.type == 'touchmove') {
          this.move = event.touches[0].screenX - this.moveStart;
        } else if (event.type == 'mousemove' && this.mousedown == true) {
          this.move = event.screenX - this.moveStart
        }

        if (this.move < 0 && this.maxScrollRight || this.move > 0 && this.maxScrollLeft) {
          translate = this.translate + this.move*0.2;
        } else {
          translate = this.translate + this.move*0.5;
        }
        this.$refs.wrapper.style.transform = `translateX(${translate}px)`;
      }, 
      onTouchEnd() {
        if (Math.abs(this.move) > this.sensitivity) {
          if (this.move > 0 && !this.maxScrollLeft) {
            this.currentPage--
          } else if (this.move < 0 && !this.maxScrollRight) {
            this.currentPage++
          } else {
            this.animateCarousel();
          }
        } else if (Math.abs(this.move) < this.sensitivity && Math.abs(this.move) > 1) {
          this.animateCarousel();
        }

        this.$refs.wrapper.style.transform = `translateX(${this.translate}px)`;
        this.mousedown = false;
        this.moveStart = null;
        this.move = null;
      },
      setLength() {
        this.length = this.$slots.default.length;
      },
      setColumns() {
        this.columns.forEach(cur => {
          if (window.matchMedia(`(min-width: ${cur[0]}px)`).matches) {
            this.numberOfColumns = cur[1];
            this.$refs.wrapper.childNodes.forEach(cur => {
              if (cur.nodeName != '#text') {
                cur.style.width = `${100/this.numberOfColumns}%`;
                if (this.currentPage + 1 > this.numberOfPages) this.currentPage = 0;
              }
            });
          }
        });

        setTimeout(() => {
          this.elementWidth = this.$slots.default[0].elm.offsetWidth;
        });
      },
      setActive() {
        this.active.forEach(cur => {
          if (window.matchMedia(`(min-width: ${cur[0]}px)`).matches) {
            this.isActive = cur[1];
          }
        });
      },
      setCarousel() {
        this.setLength();
        this.setColumns();
        this.setActive();
      },
      runCarousel() {
        if (this.autoplay) {
          this.autoplayInterval = setInterval(() => {
            this.currentPage != this.numberOfPages ? this.currentPage++ : this.currentPage = 0;
          }, this.autoplaySpeed * 1000);
        }
      }, 
    },
    mounted() {
      this.setCarousel();
      this.runCarousel();
      window.addEventListener('resize', this.setCarousel);
    },
    updated() {
      this.setCarousel();
    },
    destroyed() {
      clearInterval(this.autoplayInterval);
      clearTimeout(this.animateTimeout);
      window.removeEventListener('resize', this.setCarousel);
    }
  }
</script>

<style scoped>

  .carousel {
    overflow-x: hidden;
    overflow-y: initial;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 100%;
    position: relative;
  }

  .carousel-navdots {
    display: flex;
    justify-content: center;
  }

  .carousel-wrapper {
    display: flex;
    align-items: stretch;
    cursor: grab;
  }

  .carousel-wrapper:active {
    cursor: grabbing;
  }

  .carousel-wrapper > * {
    width: 100%;
    flex-shrink: 0;
    position: relative;
  }

  .scrolling {
    transition: transform 0.5s;
  }

  .inactive {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    cursor: default !important;
  }
  
</style>