<template>
  <div class="radio b-lightblack t-small t-green">
    <div class="pl05 pr05 option row a-center j-center" :class="{ 't-black': value }" @click="$emit('change-value', true)">
      <slot name="first"></slot>
    </div>
    <div class="pl05 pr05 option row a-center j-center" :class="{ 't-black': !value }" @click="$emit('change-value', false)">
      <slot name="second"></slot>
    </div>
    <div class="marker" :class="{ 'marker--right': !value }"></div>
  </div>
</template>

<script>
  export default {
    props: ['value']
  }
</script>

<style lang="scss" scoped>

  .radio { 
    border-radius: 15px;
    border: 1px solid color(lightblack);
    overflow: hidden;
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    .option {
      z-index: 3;
      transition: all 0.3s;
    }

    .marker {
      background-color: color(green);
      height: 100%;
      width: 50%;
      position: absolute;
      left: 0;
      transition: all 0.3s;
      z-index: 1;
    }

    .marker--right {
      transform: translateX(100%);
    }
  }

</style>