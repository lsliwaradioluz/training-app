<template>
  <div
    class="confirm"
    :class="{ 'confirm--active': showConfirm, main: showConfirm }"
  >
    <div v-show="showConfirm" class="window">
      <p class="message">
        {{ message }}
      </p>
      <div class="buttons">
        <BaseButton @click.native="confirm">Tak</BaseButton>
        <BaseButton @click.native="decline">Nie</BaseButton>
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
    };
  },
  mounted() {
    this.$root.$confirm = this.open;
  },
  methods: {
    open(message) {
      this.showConfirm = true;
      this.message = message;
      return new Promise((resolve) => {
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
    },
  },
};
</script>

<style lang="scss" scoped>
.confirm {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.confirm--active {
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

.window {
  border-radius: 0;
  max-width: 450px;
  padding: 1rem;
  background-color: color(primary);
}

.message {
  text-align: center;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

.buttons button {
  width: 49%;
}

@media (min-width: 450px) {
  .confirm--active {
    height: 80vh;
    top: 10vh;
    left: calc(50vw - 450px / 2);
    border-radius: 15px;
  }
}
</style>
