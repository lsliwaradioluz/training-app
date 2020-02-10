<template>
<div>
  <input type="date" :value="date" @input="$emit('input', $event.target.value)">
  <input type="time" :value="time" @input="$emit('input', $event.target.value)" min="07:00" max="21:00">
</div>
</template>

<script>
  export default {
    props: ['date', 'time'],
  }
</script>

<style lang="scss" scoped>
</style>