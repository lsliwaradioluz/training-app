<template>
  <div id="wrapper" ref="wrapper" @touchstart.prevent @touchmove.prevent>
    <div id="bar" ref="bar">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wrapperWidth: null,
      scrollWidth: null,
      translate: 0,
      translateTimeout: null,
      translateInterval: null,
    }
  },
  mounted() {
    this.scrollWidth = this.$refs.wrapper.scrollWidth
    this.wrapperWidth = this.$refs.wrapper.offsetWidth
    if (this.scrollWidth > this.wrapperWidth) {
      this.startMoveFunction()
    }
  },
  destroyed() {
    clearTimeout(this.translateTimeout)
    clearInterval(this.translateInterval)
  },
  methods: {
    moveFunction() {
      this.translate++
      this.$refs.wrapper.scrollLeft = this.translate
      if (this.translate + this.wrapperWidth == this.scrollWidth) {
        clearInterval(this.translateInterval)
        this.startMoveBackFunction()
      }
    },
    moveBackFunction() {
      this.translate--
      this.$refs.wrapper.scrollLeft = this.translate
      if (this.translate == 0) {
        clearInterval(this.translateInterval)
        this.startMoveFunction()
      }
    },
    startMoveFunction() {
      this.translateTimeout = setTimeout(() => {
        this.translateInterval = setInterval(this.moveFunction, 35)
      }, 1000)
    },
    startMoveBackFunction() {
      this.translateTimeout = setTimeout(() => {
        this.translateInterval = setInterval(this.moveBackFunction, 35)
      }, 1000)
    },
  },
}
</script>

<style scoped>
#wrapper {
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
}

#wrapper::-webkit-scrollbar {
  display: none;
}

#bar {
  white-space: nowrap;
}
</style>
