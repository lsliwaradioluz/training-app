<template>
  <div class="routine column tab">
    <div class="row j-between">
      <h4 class="mt0 mb1">{{ section.name }}</h4>
      <i class="flaticon-plus" @click="$emit('copy-section', section)" v-if="edit"></i>
      <i class="flaticon-accept" @click="$emit('close-score-editor')" v-if="scoreEditorOpen"></i>
    </div>
    <div :class="{ mb05: complexindex != section.complexes.length - 1 }" v-for="(complex, complexindex) in section.complexes" :key="complexindex">
      <p class="mt0 mb05 row j-between" v-if="complex.units.length > 1">
        <span>{{ complex.name }}</span>
        <i class="flaticon-plus fs-14" @click="$emit('copy-complex', complex)" v-if="edit"></i>
      </p>
      <ul class="mb05" :class="{ pl05: complex.units.length > 1}" v-for="(unit, unitindex) in complex.units" :key="unitindex">
        <div class="row j-between a-start">
          <p class="m00">{{ unit.exercise.name }}</p>
          <div v-if="!scoreEditorOpen">
            <nuxt-link
              v-if="!edit && unit.exercise.image"
              :to="`/exercises/${unit.exercise.id}`" 
              tag="i"
              class="flaticon-information fs-14 ml1"></nuxt-link>
            <i class="flaticon-plus fs-14" @click="$emit('copy-unit', unit)" v-if="edit"></i>
          </div>
          <div class="routine__max-buttons row pl1" v-else>
            <i class="flaticon-diminish fs-14" @click="$emit('subtract-max', { unit: unitindex, complex: complexindex })"></i>
            <i class="flaticon-plus fs-14" @click="$emit('add-max', { unit: unitindex, complex: complexindex })"></i>
          </div>
        </div>
        <li>
          <span v-if="unit.sets">{{ unit.sets }}</span><span v-if="unit.reps">x{{ unit.reps }}</span><span v-if="unit.time">x{{ unit.time }}s</span><span v-if="unit.distance">x{{ unit.distance }}m</span>
          <span class="t-success" v-if="unit.max && unit.max > 0">(+{{ unit.max }})</span><span class="t-error" v-if="unit.max && unit.max < 0">({{ unit.max }})</span>
        </li>
        <li>
          <span v-if="unit.remarks">{{ unit.remarks }}</span>
        </li>
        <li>
          <span class="faded">przerwa {{ unit.rest }}s</span>
        </li>
      </ul>
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
    }, 
    scoreEditorOpen: {
      type: Boolean, 
      default: () => false,
    }
  },
}
</script>

<style lang="scss" scoped>

  .routine__max-buttons {
    i:first-child {
      margin-right: 3px;
    }
  }
</style>