<template>
  <div class="search">
    <span class="icon flaticon-search" v-if="icon" />
    <input
      class="input"
      :class="{ pl15: icon }"
      :value="value"
      :placeholder="placeholder"
      spellcheck="false"
      autocomplete="off"
      @input="$emit('input', $event.target.value)"
    />
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
    },
  },
}
</script>

<style lang="scss" scoped>
.search {
  position: relative;
  margin-bottom: 1rem;
}

.icon {
  position: absolute;
  top: 17px;
  color: color(faded);
  font-size: 12px;
}

.input {
  background-color: transparent;
  border-bottom: 1px solid color(faded);
  border-radius: 0;
  font-size: 14px;
  height: 45px;
  padding-top: 0.5rem;
  padding-bottom: 0;
  transition: border-color 0.3s;
}

.input:focus {
  border-bottom: 1px solid color(headers);
}
</style>
