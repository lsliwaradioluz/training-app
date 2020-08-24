<template>
  <div
    class="confirm column j-center"
    :class="{ 'confirm__window--active': showConfirm, main: showConfirm }"
  >
    <div v-show="showConfirm" class="confirm__window tab b-primary">
      <p class="t-center">
        {{ message }}
      </p>
      <div class="confirm__window__buttons row j-between">
        <button class="button-primary" type="button" @click="confirm">
          Tak
        </button>
        <button class="button-primary" type="button" @click="decline">
          Nie
        </button>
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
  mounted() {
    this.$root.$confirm = this.open
  },
  methods: {
    open(message) {
      this.showConfirm = true
      this.message = message
      return new Promise((resolve) => {
        this.resolve = resolve
      })
    },
    confirm() {
      this.resolve(true)
      this.hide()
    },
    decline() {
      this.resolve(false)
      this.hide()
    },
    hide() {
      this.showConfirm = false
      this.message = null
    },
  },
}
</script>

<style lang="scss" scoped>
.confirm__window {
  border-radius: 0;
  max-width: 450px;
}

.confirm__window--active {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  max-width: 450px;
  background-color: rgba(0, 0, 0, 0.678);
  z-index: 1000000;
  transition: background-color 0.5s;
}

.confirm__window__buttons button {
  width: 49%;
}

@media (min-width: 450px) {
  .confirm__window--active {
    height: 80vh;
    top: 10vh;
    left: calc(50vw - 450px/2);
    border-radius: 15px;
  }
}
</style>
