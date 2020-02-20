<template>
  <div class="userpanel tab column j-center a-center t-white p22">
    <div class="avatar" :style="{ backgroundImage: `url(${backgroundImage})` }"></div>
    <h3 class="userpanel__username mt05 mb0">{{ user.username }}</h3>
    <p class="userpanel__fullname mb0">{{ user.fullname }}</p>
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
  .userpanel {
    
    h3:first-letter {
      text-transform: none;
    }
  }

  .userpanel__fullname {
    font-size: 0.7rem;
  }
</style>