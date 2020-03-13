<template>
<div>
  <audio @playing="$emit('playing')" @ended="$emit('ended')" autoplay ref="audio">
    <source :src="require(`@/assets/sounds/${soundname}`)" type="audio/ogg">
  </audio>
</div>
</template>

<script>
  export default {
    props: ['soundname', 'mute'],
    watch: {
      mute() {
        this.mute ? this.$refs.audio.muted = true : this.$refs.audio.muted = false;
      }
    }, 
    mounted() {
      this.mute ? this.$refs.audio.muted = true : this.$refs.audio.muted = false;
    },
    destroyed() {
      this.$emit('ended');
    }
  }
</script>