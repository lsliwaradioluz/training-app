<template>
  <transition name="slide-down">
    <p class="notification" v-if="notification">{{ notification }}</p>
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
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1002;
    padding: 1rem;
    font-size: 13px;
    background-color: color(headers);
    color: color(primary);
  }

  .slide-down-enter-active {
    animation: slide-down 0.3s;
  }

  .slide-down-leave-active {
    animation: slide-down 0.3s reverse;
  }

  @keyframes slide-down {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>