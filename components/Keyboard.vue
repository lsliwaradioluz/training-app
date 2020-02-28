<template>
  <div class="keyboard row j-between">
    <button 
      class="t-center b-lightblack pt1 pb1" 
      type="button"
      v-for="key in keys" :key="key" 
      @click="$emit('key-pressed', key)">{{ key }}</button>    
    <button 
      class="t-center b-lightblack pt05 pb05" 
      type="button"
      @touchstart="$emit('reveal-password')"
      @touchend="$emit('hide-password')">
      <i class="flaticon-eye"></i>
    </button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0]
      }
    }, 
  }
</script>

<style lang="scss" scoped>

  .keyboard {
    flex-wrap: wrap;

    button {
      flex-basis: calc(100%/3 - 3px);
      margin-bottom: 5px;
      border-radius: 5px;
      font-size: 1rem;
    }

    button:active {
      opacity: 0.8;
    }
  }

</style>