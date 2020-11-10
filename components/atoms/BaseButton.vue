<template>
  <button type="button" :class="`button-${theme}`">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: "primary",
    },
  },
};
</script>

<style lang="scss" scoped>
.button-primary,
.button-secondary,
.button-tertiary {
  cursor: pointer;
  border-radius: 6px;
  background-color: color(headers);
  color: color(primary);
  display: flex;
  height: auto;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-weight: 400;
  font-family: "Roboto Condensed", sans-serif;
  font-size: 14px;
  line-height: 1.5;
  text-align: center;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s;
  margin: 0;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.226);
}

.button-primary:hover,
.button-primary:focus,
.button-primary:active {
  background-color: color(darkgreen);
  border-color: color(darkgreen);
}

.button--inactive,
.button-primary:disabled {
  background-color: color(gray);
  border-color: color(gray);
}

.button--inactive:hover,
.button--inactive:focus,
.button--inactive:active {
  background-color: color(gray);
  border-color: color(gray);
}

.button-secondary,
.button-tertiary {
  background-color: transparent;
  color: color(headers);
  border: 1px solid color(headers);
  font-weight: 400;
}

.button-tertiary {
  border-color: white;
  color: white;
}

.button-switch,
.button-switch--active {
  border-bottom: 1px solid color(faded);
  color: color(faded);
  flex-basis: 100%;
  flex-shrink: 1;
  padding-bottom: 0.4rem;
  transition: all 0.3s;
  font-size: 14px;
  font-family: "Roboto Condensed", sans-serif;
  &--active {
    color: color(headers) !important;
    border-bottom: 1px solid color(headers) !important;
  }
}
</style>
