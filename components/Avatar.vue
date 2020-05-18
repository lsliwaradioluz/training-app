<template>
  <div 
    class="avatar"
    :style="styleObject">
  </div>  
</template>

<script>
  export default {
    props: {
      size: {
        type: Number, 
        default: () => 50,
      }, 
      image: {
        type: String,
        default: () => require('assets/images/user.svg')
      }
    }, 
    data() {
      return {
        styleObject: {
          height: `${this.size}px`,
          width: `${this.size}px`,
          backgroundImage: this.image ? `url('${this.image}')` : `url('${require('assets/images/person.svg')}'), linear-gradient(#23283C, #23283C)`,
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .avatar {
    background-size: cover;
    background-position: center;
    // border-radius: 6px;
    box-shadow: 0 15px 30px 0 rgba(0,0,0,.21),0 0 15px 0 rgba(0,0,0,.18);
    flex-shrink: 0;
  }
</style>