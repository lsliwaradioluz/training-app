<template>
  <transition name="slide-down">
    <div class="message-tab row j-center a-center" v-if="notification">
      <p class="fs-09 tab">{{ notification }}</p>
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
    position: fixed;
    top: 10vh;
    left: 0;
    width: 100%;
    z-index: 1002;
    padding: 0 1rem;

    p {
      background-color: rgb(160, 160, 160);
    }
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