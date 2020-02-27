<template>
  <div class="default b-black main">
    <Navigation />
    <WorkoutPairingTab v-if="$store.state.main.workoutToPair && !$route.params.id" />
    <nuxt />
  </div>
</template>

<script>
import Navigation from '~/components/Navigation';
import WorkoutPairingTab from '~/components/WorkoutPairingTab';


export default {
  middleware: 'redirect',
  components: {
    Navigation, 
    WorkoutPairingTab,
  },
}
</script>
