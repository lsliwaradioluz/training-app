<template>
  <div class="routine tab p11">
    <div class="row j-between">
      <h3 class="mt0 mb1 t-green">{{ sectionName }}</h3>
      <i class="flaticon-plus t-green" @click="$emit('copy-section', section)"></i>
    </div>
    <div v-for="block in section" :key="block.id">
      <p class="mt0 mb05 row j-between" v-if="block.units.length > 1">
        <span>{{ block.name }}</span>
      </p>
      <ul class="mb05" :class="{ pl05:  block.units.length > 1}" v-for="(unit, unitindex) in block.units" :key="unitindex">
        <p class="mb0 row j-between">
          {{ unit.exercise.name }}
          <!-- <nuxt-link
            :to="`/exercises/${unit.exercise.subcategory.category.name}/${unit.exercise.subcategory.name}/${unit.exercise.name}`" 
            tag="i"
            class="flaticon-information small"></nuxt-link> -->
          </p>
        <li>
          <span v-if="unit.sets">{{ unit.sets }}</span><span v-if="unit.reps">x{{ unit.reps }}</span><span v-if="unit.time">x{{ unit.time }}s</span><span v-if="unit.distance">{{ unit.distance }}m</span>
        </li>
        <li>
          <span v-if="unit.remarks">{{ unit.remarks }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  props: ['section', 'section-name']
}
</script>

<style lang="scss" scoped>

</style>