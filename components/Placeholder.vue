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
    opacity: 0.7;
    animation: blink 1s infinite;
    div {
      height: 5rem;
      background-color: color(secondary);
      margin-bottom: 0.5rem;
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
      opacity: 0.7;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 0.7;
    }
  }
</style>

