<template>
  <div class="pull-to-refresh" :class="{ animated: !move }" :style="{ height: `${Math.abs(this.move) / 4}px` }">
    <p class="m00 t-center">{{ Math.floor(move) }}%</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scroll: 0, 
      moveStart: null,
      move: null,
    }
  },
  methods: {
    onTouchStart() {
        this.moveStart = null;
        this.move = null;
        if (event.type == 'touchstart') {
          this.moveStart = event.touches[0].screenY
        } else {
          this.moveStart = event.screenY;
          this.mousedown = true;
        }
      },
      onTouchMove() {
        if (this.scroll == 0 && this.move != null) { 
          document.body.style.overflow = "hidden";
        }
        if (event.type == 'touchmove') {
          this.move = event.touches[0].screenY - this.moveStart;
        } else if (event.type == 'mousemove' && this.mousedown == true) {
          this.move = event.screenY - this.moveStart
        }
      }, 
      onTouchEnd() {
        if (Math.abs(this.move) >= 100) {
          window.location.reload();
        } else {
          this.move = null;
        }
        document.body.style.overflow = "scroll";
      },
  },
  mounted() {
    if (navigator.vendor != 'Google Inc.') {
      window.addEventListener('touchstart', () => {
        this.scroll = window.scrollY;
        if (this.scroll == 0) this.onTouchStart();
      });
      window.addEventListener('touchmove', () => {
        if (this.scroll == 0 && this.move >= 0) {
          this.onTouchMove();
        }
      });
      window.addEventListener('touchend', () => {
        this.onTouchEnd();
      });
    }
  }
}
</script>

<style lang="scss" scoped>

  .pull-to-refresh {
    position: absolute;
    top: 100%;
    height: 0;
    overflow: hidden;
  }

  .animated {
    transition: transform 0.1s;
  }
</style>