<template>
<div>
  <audio autoplay @playing="$emit('playing')" @ended="$emit('ended')">
    <source :src="require(`@/assets/sounds/${soundname}`)" type="audio/ogg">
  </audio>
</div>
</template>

<script>
  export default {
    props: ['soundname'],
  }
</script>