<template>
  <div class="routine column tab fg1">
    <div class="row j-between">
      <h3 class="mt0 mb1">{{ section.name }}</h3>
      <i class="flaticon-plus" @click="$emit('copy-section', section)" v-if="edit"></i>
      <div v-else>
        <i class="flaticon-list" @click="toggleMaxEditor" v-if="!maxEditorOpen"></i>
        <i class="flaticon-accept" @click="toggleMaxEditor" v-else></i>
      </div>
    </div>
    <div class="mb05" v-for="(complex, complexindex) in section.complexes" :key="complexindex">
      <h4 class="mt0 mb05 t-green row j-between" v-if="complex.units.length > 1">
        <span>{{ complex.name }}</span>
        <i class="flaticon-plus fs-09" @click="$emit('copy-complex', complex)" v-if="edit"></i>
      </h4>
      <ul class="mb05" :class="{ pl05: complex.units.length > 1}" v-for="(unit, unitindex) in complex.units" :key="unitindex">
        <div class="row j-between a-start">
          <p class="m00">{{ unit.exercise.name }}</p>
          <div v-if="!maxEditorOpen">
            <nuxt-link
              v-if="!edit && unit.exercise.image"
              :to="`/exercises/${unit.exercise.id}`" 
              tag="i"
              class="flaticon-information fs-09 ml1"></nuxt-link>
            <i class="flaticon-plus fs-09" @click="$emit('copy-unit', unit)" v-if="edit"></i>
          </div>
          <div class="routine__max-buttons row pl1" v-if="maxEditorOpen">
            <i class="flaticon-diminish fs-09" @click="$emit('subtract-max', { unit: unitindex, complex: complexindex })"></i>
            <i class="flaticon-plus fs-09" @click="$emit('add-max', { unit: unitindex, complex: complexindex })"></i>
          </div>
        </div>
        <li>
          <span v-if="unit.sets">{{ unit.sets }}</span><span v-if="unit.reps">x{{ unit.reps }}</span><span v-if="unit.time">x{{ unit.time }}s</span><span v-if="unit.distance">x{{ unit.distance }}m</span>
          <span class="t-green" v-if="unit.max && unit.max > 0">(+{{ unit.max }})</span><span class="t-red" v-if="unit.max && unit.max < 0">({{ unit.max }})</span>
        </li>
        <li>
          <span v-if="unit.remarks">{{ unit.remarks.toLowerCase() }}</span>
        </li>
        <li>
          <span class="t-gray">przerwy {{ unit.rest }}s</span>
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
    }
  },
  data() {
    return {
      maxEditorOpen: false,
      moveStart: null,
      move: null,
    }
  },
  methods: {
    toggleMaxEditor() {
      if (!this.maxEditorOpen) {
        this.maxEditorOpen = true;
      } else { 
        this.maxEditorOpen = false;
        this.$emit('upload-workout');
      }
      this.$emit('toggle-max-editor', this.maxEditorOpen);
    }, 
  }
}
</script>

<style lang="scss" scoped>

  .routine__max-buttons {
    i:first-child {
      margin-right: 3px;
    }
  }
</style>