<template>
  <div class="default b-black main">
    <PullToRefresh />
    <Navigation />
    <WorkoutPairingTab v-if="$store.state.main.workoutToPair && !$route.params.id" />
    <WorkoutCopyingTab v-if="$store.state.main.workoutToCopy" />
    <nuxt />
  </div>
</template>

<script>
import Navigation from '~/components/Navigation';
import WorkoutPairingTab from '~/components/WorkoutPairingTab';
import WorkoutCopyingTab from '~/components/WorkoutCopyingTab';
import PullToRefresh from '~/components/PullToRefresh';

export default {
  middleware: 'redirect',
  components: {
    Navigation, 
    WorkoutPairingTab,
    WorkoutCopyingTab, 
    PullToRefresh,
  },
}
</script>
