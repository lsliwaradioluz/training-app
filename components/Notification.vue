<template>
  <transition name="slide-down">
    <div class="notification row j-center a-center" v-if="notification">
      <p class="notification__message fs-12">{{ notification }}</p>
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        timeout: null
      }
    },
    watch: {
      notification(value) {
        if (value) {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.$store.commit('main/setNotification', null);
          }, 2000);
        }
      }
    },
    computed: {
      notification() {
        return this.$store.state.main.notification;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .notification {
    position: fixed;
    bottom: 10vh;
    left: 0;
    width: 100%;
    z-index: 1002;
    padding: 0 1rem;
  }

  .notification__message {
    background-color: white;
    color: color(gradient);
    padding: 1rem;
    border-radius: 12px;
  }

  .slide-down-enter-active {
    animation: slide-down 0.3s;
  }

  .slide-down-leave-active {
    animation: slide-down 0.3s reverse;
  }

  @keyframes slide-down {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>