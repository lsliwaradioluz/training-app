<template>
  <div class="custom-select">
    <transition name="slide-to-left">
      <label class="label" v-show="value">{{ placeholder }}</label>
    </transition>
    <p v-show="!value" class="placeholder">
      {{ placeholder }}
    </p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
    },
    placeholder: {
      type: String,
    },
    showLabel: {
      type: Boolean,
      default: () => false,
    },
  },
}
</script>

<style lang="scss" scoped>

.custom-select {
  position: relative;
  margin-bottom: 1rem;
  transition: margin 0.3s;
  color: color(text);
}

.label {
  position: absolute;
  top: -3px;
  font-weight: 500;
  font-size: 10px;
  color: color(faded);
}

.placeholder {
  color: color(faded);
  position: absolute;
  left: 0;
  bottom: 5px;
  margin: 0;
}

select {
  display: block;
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 0;
  font-size: 14px;
  height: 45px;
  transition: all 0.25s ease;
  color: color(text);
  border-bottom: 1px solid color(faded);
  border-left: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

select:focus {
  border-bottom: 1px solid color(headers);
}

option {
  color: white;
  border: none;
  background-color: color(secondary);
  padding-left: .5rem;
}

option:disabled {
  color: color(faded);
}
</style>
