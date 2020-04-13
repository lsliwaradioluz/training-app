<template>
  <div class="custom-checkbox">
    <label>{{ label }}</label>
    <input
      :value="value"
      type="checkbox"
      @input="$emit('input', $event.target.checked)">
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean, 
      },
      label: {
        type: String, 
      },
      disabled: {
        type: Boolean, 
        default: () => false,
      },
    },
  }
</script>

<style lang="scss" scoped>

  .custom-checkbox {
    position: relative;
    margin-bottom: 1rem;
    transition: margin 0.3s;
    color: color(text);
    display: flex;
    align-items: flex-end;
    label {
      position: absolute;
      top: -3px;
      font-weight: 500;
      font-size: 10px;
      color: color(faded);
    }
  }

  input {
    margin-bottom: 0;
    appearance: none;
    height: 20px;
    width: 20px;
    border: 2px solid color(headers);
    transition: all 0.3s;
  }

  input:checked {
    background-color: color(headers);
  }
</style>