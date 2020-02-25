<template>
  <div class="b-black">
    <nuxt />
  </div>
</template>

<script>
import Navigation from '~/components/Navigation'


export default {
  middleware: 'redirect',
}
</script>
