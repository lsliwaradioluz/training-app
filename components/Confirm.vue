<template>
  <div class="confirm column j-center" :class="{ 'confirm--active': showConfirm, 'main': showConfirm }">
    <div class="window tab b-primary" v-show="showConfirm">
      <p class="t-center">{{ message }}</p>
      <div class="buttons row j-between">
        <button class="button-primary" type="button" @click="confirm">Tak</button>
        <button class="button-primary" type="button" @click="decline">Nie</button>
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
      decline() {
        this.resolve(false);
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

  .window {
    border-radius: 0;
  }

  .confirm--active {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.678);
    z-index: 1000000;
    transition: background-color 0.5s;
  }

  .buttons button {
    width: 49%;
  }
</style>