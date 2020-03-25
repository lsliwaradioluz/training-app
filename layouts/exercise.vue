<template>
  <div class="b-black">
    <Navigation transparent />
    <nuxt />
    <Confirm />
  </div>
</template>

<script>
import Navigation from '~/components/Navigation';

export default {
  middleware: 'redirect',
  components: {
    Navigation, 
  },
}
</script>
