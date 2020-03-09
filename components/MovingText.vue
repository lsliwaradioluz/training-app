<template>
  <div id="wrapper" ref="wrapper">
    <slot></slot>
    <div id="bar" ref="bar">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        wrapperWidth: null,
        barWidth: null,
        translate: 0,
        translateTimeout: null,
        translateInterval: null,
      }
    }, 
    methods: {
      moveFunction() {
        this.translate--;
        this.$refs.bar.style.left = `${this.translate}px`;
        if (Math.abs(this.translate) == this.barWidth - this.wrapperWidth) {
          clearInterval(this.translateInterval);
          this.startMoveBackFunction();
        }
      }, 
      moveBackFunction() {
        this.translate++;
        this.$refs.bar.style.left = `${this.translate}px`;
        if (this.translate == 0) {
          clearInterval(this.translateInterval);
          this.startMoveFunction();
        }       
      }, 
      startMoveFunction() {
        this.translateTimeout = setTimeout(() => {
          this.translateInterval = setInterval(this.moveFunction, 35);
        }, 2000);
      }, 
      startMoveBackFunction() {
        this.translateTimeout = setTimeout(() => {
          this.translateInterval = setInterval(this.moveBackFunction, 35);
        }, 2000);
      }
    },
    mounted() {
      this.barWidth = this.$refs.bar.offsetWidth;
      this.wrapperWidth = this.$refs.wrapper.offsetWidth;
      if (this.wrapperWidth < this.barWidth) {
        this.startMoveFunction();
      }
    }, 
    destroyed() {
      clearTimeout(this.translateTimeout);
      clearInterval(this.translateInterval);
    }
  }
</script>

<style lang="scss" scoped>

#wrapper {
  min-height: 10px;
  width: 100%;
  position: relative;
  overflow: hidden;
  color: transparent;
  white-space: nowrap;
}

#bar {
  position: absolute;
  top: 0;
  white-space: nowrap;
  color: white;
}

</style>