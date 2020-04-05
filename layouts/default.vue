<template>
  <div class="default b-black" :class="{ main: !isAssistant }">
    <Navigation :transparent="isAssistant" />
    <WorkoutPairingTab v-if="$store.state.main.workoutToPair && $route.path.includes('users') &&!$route.params.id" />
    <WorkoutCopyingTab v-if="$store.state.main.workoutToCopy && $route.path.includes('users') &&!$route.params.id" />
    <Confirm />
    <nuxt />
  </div>
</template>

<script>
import Navigation from '~/components/Navigation';
import WorkoutPairingTab from '~/components/WorkoutPairingTab';
import WorkoutCopyingTab from '~/components/WorkoutCopyingTab';
export default {
  middleware: 'redirect',
  components: {
    Navigation, 
    WorkoutPairingTab,
    WorkoutCopyingTab, 
  },
  computed: {
    isAssistant() {
      return this.$store.state.assistant.showWorkoutAssistant;
    },
  }
}
</script>