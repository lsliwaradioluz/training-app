<template>
  <transition name="slide-up">
    <p v-if="notification" class="notification m00" @click="unsetNotification">
      {{ notification }}
    </p>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      timeout: null,
    }
  },
  computed: {
    notification() {
      return this.$store.state.main.notification
    },
  },
  watch: {
    notification(value) {
      if (value) {
        const notificationLength = this.notification.length;
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.unsetNotification();
        }, notificationLength*50)
      }
    },
  },
  methods: {
    unsetNotification() {
      this.$store.commit("main/setNotification", null)
    },
  },
}
</script>

<style lang="scss" scoped>
.notification {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10020;
  padding: 1rem;
  font-size: 13px;
  background-color: color(headers);
  color: color(primary);
}

.slide-up-enter-active {
  animation: slide-up 0.3s;
}

.slide-up-leave-active {
  animation: slide-up 0.3s reverse;
}

@keyframes slide-up {
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
