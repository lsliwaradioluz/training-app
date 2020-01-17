<template>
  <div>
    <Signin />
  </div>
</template>

<script>
import Signin from '~/components/Signin'

export default {
  layout: 'login',
  components: {
    Signin, 
  }
}
</script>