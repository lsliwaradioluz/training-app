<template>
  <div class="routine column">
    <div class="routine__exercises tab">
      <div class="row j-between">
        <h3 class="mt0 mb1">{{ section.name }}</h3>
        <i class="flaticon-plus" @click="$emit('copy-section', section)" v-if="edit"></i>
      </div>
      <div class="mb05" v-for="complex in section.complexes" :key="complex.id">
        <h4 class="mt0 mb05 t-green row j-between" v-if="complex.units.length > 1">
          <span>{{ complex.name }}</span>
          <i class="flaticon-plus small" @click="$emit('copy-complex', complex)" v-if="edit"></i>
        </h4>
        <ul class="mb05" :class="{ pl05: complex.units.length > 1}" v-for="(unit, unitindex) in complex.units" :key="unitindex">
          <p class="m00 row j-between">
            <span>{{ unit.exercise.name }}</span>
            <nuxt-link
              v-if="!edit"
              :to="`/exercises/${unit.exercise.subcategory.category.name}/${unit.exercise.subcategory.name}/${unit.exercise.name}`" 
              tag="i"
              class="flaticon-information small"></nuxt-link>
            <i class="flaticon-plus small" @click="$emit('copy-unit', unit)" v-else></i>
          </p>
          <li>
            <span v-if="unit.sets">{{ unit.sets }}</span><span v-if="unit.reps">x{{ unit.reps }}</span><span v-if="unit.time">x{{ unit.time }}s</span><span v-if="unit.distance">x{{ unit.distance }}m</span>
          </li>
          <li>
            <span v-if="unit.remarks">{{ unit.remarks }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="routine__rest mb05 tab" v-if="!edit">
      <h3 class="mt0">Odpoczynek</h3>
      <p class="m00">
        W sekcji {{ section.name }}, wykonując ćwiczenia pojedynczo, odpoczywaj przez <span class="t-green">{{ section.rest }}</span> sekund między seriami. Jeżeli przeplatasz ćwiczenia w ramach bloku, odpoczywaj przez <span class="t-green">{{ Math.floor(section.rest / 2) }}</span> sekund.
      </p>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    section: {
      type: Object,
    },
    edit: {
      type: Boolean, 
      default: () => false,
    }
  },
}
</script>

<style lang="scss" scoped>
  .routine__exercises {
    flex-grow: 1;
  }
</style>