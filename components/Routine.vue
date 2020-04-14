<template>
  <div class="routine tab fg1 column">
    <div class="row j-between">
      <h3 class="mt0 mb1">{{ section.name }}</h3>
      <i class="flaticon-plus-1" @click="$emit('copy-section', section)" v-if="edit"></i>
      <i class="flaticon-accept" @click="$emit('close-score-editor')" v-if="scoreEditorOpen"></i>
    </div>
    <div :class="{ mb05: complexindex != section.complexes.length - 1 }" v-for="(complex, complexindex) in section.complexes" :key="complexindex">
      <div class="mt0 mb05 row j-between" v-if="complex.units.length > 1">
        <h4 class="mb0">{{ complex.name }}</h4>
        <i class="flaticon-plus-1 fs-14" @click="$emit('copy-complex', complex)" v-if="edit"></i>
      </div>
      <ul class="mb05 row j-between" :class="{ pl05: complex.units.length > 1}" v-for="(unit, unitindex) in complex.units" :key="unitindex">
        <div>
          <p class="m00">{{ unit.exercise.name }}</p>
          <li>
            <span v-if="unit.sets">{{ unit.sets }}</span><span v-if="unit.reps">x{{ unit.reps }}</span><span v-if="unit.time">x{{ unit.time }}s</span><span v-if="unit.distance">x{{ unit.distance }}m</span>
            <span class="t-success" v-if="unit.max && unit.max > 0">(+{{ unit.max }})</span><span class="t-error" v-if="unit.max && unit.max < 0">({{ unit.max }})</span>
          </li>
          <li>
            <span v-if="unit.remarks">{{ unit.remarks }}</span>
          </li>
          <li>
            <span class="t-faded">przerwa {{ unit.rest }}s</span>
          </li>
        </div>
        <i class="flaticon-plus-1 fs-10" @click="$emit('copy-unit', unit)" v-if="edit"></i>
        <!-- <nuxt-link
          :to="`/exercises/${unit.exercise.id}`" 
          tag="div"
          class="exercise-avatar ml05"
          :style="{ backgroundImage: `url('${unit.exercise.image ? unit.exercise.image.url : require('assets/images/exercise.jpg')}')` }"
          v-else></nuxt-link> -->
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