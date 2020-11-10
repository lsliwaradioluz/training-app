<template>
  <div ref="default" class="default" :class="{ main: !isAssistant }">
    <NavigationTop />
    <NavigationBottom />
    <Confirm />
    <Notification />
    <nuxt />
  </div>
</template>

<script>
import NavigationTop from "~/components/molecules/NavigationTop"
import NavigationBottom from "~/components/molecules/NavigationBottom"

export default {
  middleware: "redirect",
  components: { NavigationTop, NavigationBottom },
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
