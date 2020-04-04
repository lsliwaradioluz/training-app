<template>
  <transition name="slide-down">
    <div class="message-tab row" v-if="notification">
      <p class="fs-09 m00"><i class="flaticon-information fs-09 mr05"></i>{{ notification }}</p>
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
  .message-tab {
    position: absolute;
    background-color: color(black);
    top: 100%;
    left: 0;
    width: 100%;
    padding: 1rem;
    padding-top: 0;
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