<template>
  <div class="video" :style="{ backgroundColor: `rgba(0,0,0,${opacity})` }">
    <video
      autoplay
      loop
      muted
      playsinline
    >
      <source :src="source" type="video/webm" />
      <source :src="source" type="video/mp4" />
    </video>
  </div>  
</template>

<script>
  export default {
    props: {
      source: {
        type: String, 
        required: true, 
      },
      opacity: {
        type: String, 
        default: "0.6"
      }
    }
  }
</script>


<style lang="scss" scoped>
  .video {
    position: absolute; 
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    &::after {
      content: "";
      position: absolute; 
      top: 0;
      left: 0; 
      height: 100%;
      width: 100%;
      background-color: inherit;
    }
    video {
      object-fit: cover;
      position: absolute; 
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
  }
</style>