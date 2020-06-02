<template>
  <div ref="default" class="default" :class="{ main: !isAssistant }">
    <Navigation v-if="!isAssistant" />
    <Confirm />
    <Notification />
    <nuxt />
  </div>
</template>

<script>
import Navigation from "~/components/Navigation"

export default {
  middleware: "redirect",
  components: { Navigation },
  computed: {
    isAssistant() {
      return this.$store.state.assistant.showWorkoutAssistant
    },
  },
}
</script>

<style lang="scss" scoped>
.default {
  position: relative;
  min-height: 100vh;
  background-color: color(primary);
}

@media (min-width: 768px) {
  .default {
    max-width: 400px;
    min-height: 0;
    height: 90vh;
    overflow-y: scroll;
    overflow-x: hidden;
    margin: 5vh auto;
    border-radius: 15px;
    box-shadow: 0 0 0 5px black;
  }
}
</style>
