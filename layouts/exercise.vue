<template>
  <div class="b-black">
    <Navigation transparent />
    <nuxt />
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
