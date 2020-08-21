<template>
  <article class="scrollable">
    <section class="scrollable__container" @scroll="onScroll" ref="scrollContainer">
      <slot></slot>
    </section>
    <div class="scrollable__track" ref="track">
      <div class="scrollable__progress" ref="progressBar" />
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
      startingScroll: null,
      trackContainerRatio: null,
    };
  },
  methods: {
    setTrackContainerRatio() {
      const containerWidth = this.$refs.scrollContainer.clientWidth;
      const scrollWidth = this.$refs.scrollContainer.scrollWidth - containerWidth;
      const thumbWidth = this.$refs.thumb.clientWidth;
      this.trackContainerRatio = (containerWidth - thumbWidth) / scrollWidth;
    },
    onScroll() {
      if (!this.trackContainerRatio) {
        this.setTrackContainerRatio();
      }

      const currentScroll = event.target.scrollLeft;
      const distance = currentScroll * this.trackContainerRatio;

      this.$refs.thumb.style.left = `${distance}px`;
      this.$refs.progressBar.style.width = `${distance}px`;
    },
    onTouchStart() {
      if (!event.touches) {
        return;
      }
      if (!this.trackContainerRatio) {
        this.setTrackContainerRatio();
      }

      document.querySelector("body").style.overflow = "hidden"
      this.$refs.thumb.classList.add("scrollable__thumb--active");
      this.touchStart = event.touches[0].screenX;
      this.startingScroll = this.$refs.scrollContainer.scrollLeft
    },
    onTouchMove() {
      if (!event.touches) {
        return;
      }

      const moveLength = event.touches[0].screenX - this.touchStart
      this.$refs.scrollContainer.scrollLeft = this.startingScroll + (moveLength / this.trackContainerRatio)
    },
    onTouchEnd() {
      this.$refs.thumb.classList.remove("scrollable__thumb--active");
      document.querySelector("body").style.overflow = "auto"
    },
  },
};
</script>

<style lang="scss" scoped>
.scrollable__container {
  display: flex;
  justify-content: space-between;
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
  height: 100%;
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
  animation: bounce 0.3s;
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
