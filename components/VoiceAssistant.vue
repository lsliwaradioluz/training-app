<template>
<div>
  <audio @playing="$emit('playing')" @ended="$emit('ended')" ref="audio" autoplay>
    <source :src="require(`@/assets/sounds/${soundname}`)" type="audio/mpeg">
  </audio>
</div>
</template>

<script>
  export default {
    props: ['soundname'],
    mounted() {
      this.$refs.audio.volume = 0.3;
    },
    destroyed() {
      this.$emit('ended');
    }
  }
</script>