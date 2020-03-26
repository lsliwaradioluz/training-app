<template>
  <div class="placeholder">
    <div class="tab" v-for="n in 7" :key="n"></div>   
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
  .placeholder {
    opacity: 0.8;
    animation: blink 1s infinite;
    div {
      height: 5rem;
      &:first-child {
        height: 10rem;
      }
      &:nth-child(2) {
        height: 3rem;
      }
    }
  }

  @keyframes blink {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.2;
    }
    100% {
      opacity: 0.5;
    }
  }
</style>

