<template>
  <article class="scrollable">
    <section class="scrollable__container" @scroll="onScroll" ref="scrollable">
      <slot></slot>
    </section>
    <div class="scrollable__track" ref="track">
      <div class="scrollable__progress" ref="progress" />
      <div
        class="scrollable__thumb"
        ref="thumb"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @mousedown="onTouchStart"
        @mousemove="onTouchMove"
        @mouseup="onTouchEnd"
      >
        <span><</span>
        <span>></span>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  data() {
    return {
      touchStart: null,
      thumbPosition: null, 
      currentScroll: null,
    };
  },
  methods: {
    onScroll() {
      const containerWidth = this.$refs.scrollable.clientWidth;
      const scrollWidth = this.$refs.scrollable.scrollWidth - containerWidth;
      const thumbWidth = this.$refs.thumb.clientWidth
      this.currentScroll = event.target.scrollLeft;

      const trackToWidthRatio = (containerWidth - thumbWidth) / scrollWidth;
      const distance = this.currentScroll * trackToWidthRatio;

      this.$refs.thumb.style.left = `${distance}px`;
      this.$refs.progress.style.width = `${distance}px`;
    },
    onTouchStart() {
      if (!event.touches) {
        return
      }
      this.$refs.thumb.classList.add("scrollable__thumb--active");
      this.touchStart = event.touches[0].screenX
      this.thumbPosition = +this.$refs.thumb.style.left.replace("px","");
    },
    onTouchMove() {
      if (!event.touches) {
        return
      }
      const move = event.touches[0].screenX - this.touchStart
      this.$refs.thumb.style.left = `${this.thumbPosition + move}px`;

      const containerWidth = this.$refs.scrollable.clientWidth;
      const scrollWidth = this.$refs.scrollable.scrollWidth - containerWidth;
      const thumbWidth = this.$refs.thumb.clientWidth
      const trackToWidthRatio = (containerWidth - thumbWidth) / scrollWidth;
      
      if (this.thumbPosition + move < 0) {
        this.$refs.thumb.style.left = '0';
      } else if (this.thumbPosition + move > this.$refs.track.clientWidth - thumbWidth) {
        this.$refs.thumb.style.left = `${this.$refs.track.clientWidth - thumbWidth}px`;
      }

      this.$refs.scrollable.scrollLeft = +this.$refs.thumb.style.left.replace("px","") / trackToWidthRatio
    }, 
    onTouchEnd() {
      this.$refs.thumb.classList.remove("scrollable__thumb--active");
      this.thumbPosition = null;
      this.touchStart = null;
    }
  },
};
</script>

<style lang="scss" scoped>
.scrollable__container {
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
}

.scrollable__track {
  height: 2px;
  background-color: rgb(201, 201, 201);
  width: 100%;
  margin-top: 40px;
  position: relative;
}

.scrollable__progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  background-color: #ff8000;
}

.scrollable__thumb {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: -24px;
  background-color: #ff8000;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.scrollable__thumb--active {
  animation: bounce .3s;
  animation-fill-mode: forwards;
}

@keyframes bounce {
  0% {
    transform: scale(1);
    padding: 0;
  }
  50% {
    transform: scale(1.2);
    padding: 10px;
  }
  100% {
    transform: scale(1.1);
    padding: 7px;
  }
}

</style>
