<template>
  <div 
    ref="pull"
    class="pull-to-refresh row j-center a-center"
    :style="{ top: `${-40 + Math.floor(move)}px`, opacity: `${Math.floor(move)/150}`, transform: `rotate(${Math.floor(move*1.5)}deg)`,  }">
    <i class="flaticon-counterclockwise t-black"></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scroll: 0, 
      moveStart: null,
      move: null,
      moving: false,
    }
  },
  methods: {
    onTouchStart() {
        this.moveStart = null;
        this.move = null;
        this.moveStart = event.touches[0].screenY;
      },
      onTouchMove() {
        if (this.scroll == 0 && this.move != null) { 
          // document.body.style.overflow = "hidden";
          this.moving = true;
        }
        
        if (event.touches[0].screenY - this.moveStart < 220) {
          this.move = event.touches[0].screenY - this.moveStart;
        }
      }, 
      onTouchEnd() {
        this.$refs.pull.classList.add('go-back');
        setTimeout(() => {
            this.$refs.pull.classList.remove('go-back');
          }, 300);
        if (Math.abs(this.move) >= 150) {
          this.move = 150;
          this.$refs.pull.classList.add('icon--spinning');
          window.location.reload();
        } else {
          this.move = 0;
          this.moving = false;
          // document.body.style.overflow = "scroll";
        }
      },
  },
  mounted() {
    // if (navigator.vendor != 'Google Inc.') {
      window.addEventListener('touchstart', () => {
        this.scroll = window.scrollY;
        if (this.scroll == 0 && !this.moving) this.onTouchStart();
      });
      window.addEventListener('touchmove', () => {
        if (this.scroll == 0 && this.move >= 0 || this.scroll == 0 && this.moving) {
          this.onTouchMove();
        }
      });
      window.addEventListener('touchend', () => {
        this.onTouchEnd();
      });
    // }
  }
}
</script>

<style lang="scss" scoped>

  .pull-to-refresh {
    position: fixed;
    height: 40px;
    width: 40px;
    top: -40px;
    overflow: hidden;
    background-color: white;
    border-radius: 50%;
    padding: 0.5rem;
    border: 1px solid black;
  }

  .go-back {
    transition: all 0.3s;
  }

</style>