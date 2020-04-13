<template>
  <div class="userpanel column j-center a-center">
    <div class="avatar" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
    <h3 class="userpanel__username mt05 mb0">{{ user.username }}</h3>
    <p class="userpanel__fullname mb0 fs-12">{{ user.fullname }}</p>
  </div>
</template>

<script>
export default {
  props: ['user'],
  computed: {
    backgroundImage() {
      return this.user.image ? this.user.image.url : require('assets/images/user.svg');
    }
  }
}
</script>

<style lang="scss" scoped>
</style>