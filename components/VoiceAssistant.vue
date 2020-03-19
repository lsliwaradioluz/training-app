<template>
<div>
  <audio @playing="$emit('playing')" @ended="$emit('ended')" ref="audio" autoplay controls>
    <source :src="require(`@/assets/sounds/${soundname}`)" type="audio/mpeg">
  </audio>
</div>
</template>

<script>
  export default {
    props: ['soundname'],
    destroyed() {
      this.$emit('ended');
    }
  }
</script>