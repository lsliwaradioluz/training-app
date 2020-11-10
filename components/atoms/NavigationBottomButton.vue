<template>
  <nuxt-link
    tag="li"
    class="navigation-bottom-button"
    :class="`flaticon-${icon}`"
    :to="`/${destination}`"
  />
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.navigation-bottom-button {
  padding: 1rem 0;
  text-align: center;
  width: 20%;
  font-size: 16px;
  font-weight: 600;
  border: none;
  padding-left: 0;
}

.nuxt-link-active {
  color: color(headers);
}
</style>
