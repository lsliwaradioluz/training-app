<template>
  <div class="keyboard">
    <div class="keyboard__keys row j-between">
      <div class="keyboard__key t-center b-lightblack pt05 pb05" v-for="key in keys" :key="key" @click="$emit('key-pressed', key)">{{ key }}</div>    
      <div 
        class="keyboard__key t-center b-lightblack pt05 pb05" 
        @touchstart="$emit('reveal-password')"
        @touchend="$emit('hide-password')">Pokaż</div>
    </div>
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

  .keyboard__keys {
    flex-wrap: wrap;
  }

  .keyboard__key {
    flex-basis: calc(100%/3 - 3px);
    margin-bottom: 5px;
    border-radius: 5px;
  }
</style>