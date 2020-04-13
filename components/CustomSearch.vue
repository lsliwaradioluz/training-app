<template>
  <div class="search">
    <i class="flaticon-search fs-14" v-if="icon"></i>
    <input
      :class="{ pl15: icon }"
      :value="value" 
      :placeholder="placeholder"
      spellcheck="false"
      autocomplete="off"
      @input="$emit('input', $event.target.value)">
  </div>  
</template>

<script>
  export default {
    props: {
      value: {
        type: String, 
      },
      placeholder: {
        type: String, 
      },
      icon: {
        type: Boolean, 
        default: () => true,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search {
    position: relative;
    i {
      position: absolute;
      top: 18px;
      color: color(faded);
    }
  }

  input {
    background-color: transparent;
    border-bottom: 1px solid color(faded);
    border-radius: 0;
    margin-bottom: 1rem;
    font-size: 13px;
    height: 50px;
    line-height: 50px;
    padding-top: .5rem;
    padding-bottom: 0;
    transition: border-color 0.3s;
  }

  input:focus {
    border-bottom: 1px solid color(headers);
  }
</style>