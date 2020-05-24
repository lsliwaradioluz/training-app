<template>
  <div class="modal">
    <transition name="fade">
      <div v-if="show" class="modal__shadow" />
    </transition>
    <transition :name="transition">
      <div v-if="show" class="modal__content" @click.self="$emit('close')">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
      default: () => false,
    },
    transition: {
      type: String,
      required: false,
      default: () => "fade",
    },
  },
}
</script>

<style scoped>
.modal {
  position: absolute;
}

.modal__shadow {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.678);
  z-index: 1001;
}

.modal__content {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  z-index: 1002;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 1rem;
}
</style>
