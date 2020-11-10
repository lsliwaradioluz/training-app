<template>
  <span class="tab-icon" :class="`flaticon-${name}`" :style="{ color }" />
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: () => "#FDDCBD",
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-icon {
  display: flex;
  align-items: center;
  font-size: 18px;
}
</style>
