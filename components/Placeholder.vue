<template>
  <div class="placeholder">
    <div v-for="n in 7" :key="n"></div>   
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
  .placeholder {
    opacity: 0.3;
    animation: blink 1s infinite;
    div {
      height: 5rem;
      background-color: rgba(255, 255, 255, 0.527);
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
      opacity: 0.3;
    }
    50% {
      opacity: 0.2;
    }
    100% {
      opacity: 0.3;
    }
  }
</style>

