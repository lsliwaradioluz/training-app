<template>
  <div class="default" :class="{ main: !isAssistant }">
    <Navigation v-if="!isAssistant" />
    <Confirm />
    <Notification />
    <nuxt />
  </div>
</template>

<script>
import Navigation from '~/components/Navigation';

export default {
  middleware: 'redirect',
  components: { Navigation },
  computed: {
    isAssistant() {
      return this.$store.state.assistant.showWorkoutAssistant;
    },
  }
}
</script>


<style lang="scss" scoped>
  .default {
    position: relative;
    min-height: 100vh;
  }
</style>