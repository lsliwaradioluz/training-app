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
    max-width: 450px;
  }

  @media (min-width: 450px) {
    .default {
      min-height: 0;
      min-width: 450px;
      height: 80vh;
      overflow: scroll;
      border: 4px solid black;
      border-radius: 15px;
    }

    ::-webkit-scrollbar {
      display: none;
    }
  }
</style>
