<template>
  <div class="confirm column j-center" :class="{ 'confirm--active': showConfirm, 'main': showConfirm }">
    <div class="confirm__window tab" v-show="showConfirm">
      <p class="t-center">{{ message }}</p>
      <div class="confirm__buttons row j-around">
        <button class="button--primary pl2 pr2" type="button" @click="confirm">Tak</button>
        <button class="button--primary pl2 pr2" type="button" @click="hide">Nie</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showConfirm: false,
        message: null, 
        resolve: null, 
        reject: null,
      }
    },
    methods: {
      open(message) {
        this.showConfirm = true;
        this.message = message;
        return new Promise((resolve, reject) => {
          this.resolve = resolve;
        }); 
      }, 
      confirm() {
        this.resolve(true);
        this.hide();
      },
      hide() {
        this.showConfirm = false;
        this.message = null;
      }
    }, 
    mounted() {
      this.$root.$confirm = this.open;
    }
  }
</script>

<style lang="scss" scoped>

  .confirm--active {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.514);
    z-index: 1000000;
    transition: background-color 0.5s;
  }
</style>