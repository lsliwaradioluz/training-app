<template>
  <article class="routine" :class="{ 'routine--expanded': editor }">
    <section class="header">
      <h3>{{ section.name }}</h3>
      <aside>
        <slot name="section-buttons" />
      </aside>
    </section>
    <Draggable
      class="complexes"
      button="complex-move-button"
      v-model="sectionToModify.complexes"
      @dragging="$emit('dragging')"
      @input="$emit('dragend', sectionToModify)"
    >
      <section
        v-for="(complex, complexindex) in section.complexes"
        :key="complexindex"
        class="complex"
        :class="{
          mb05: complexindex != section.complexes.length - 1,
          blind: currentComplex != null && currentComplex != complexindex,
        }"
      >
        <div class="complex__header">
          <h5 class="complex__header__name">{{ complex.name }}</h5>
          <aside class="complex__header__buttons">
            <slot
              name="complex-buttons"
              :complex="complex"
              :complexindex="complexindex"
            />
          </aside>
        </div>
        <Draggable
          class="units"
          button="unit-move-button"
          v-model="sectionToModify.complexes[complexindex].units"
          @dragging="$emit('dragging')"
          @input="$emit('dragend', sectionToModify)"
        >
          <div
            v-for="(unit, unitindex) in complex.units"
            :key="unitindex"
            class="unit"
          >
            <div>
              <p class="unit__exercise-name">{{ unit.exercise.name }}</p>
              <ul>
                <li>{{ setsAndReps(unit) }}</li>
                <li v-if="unit.remarks">{{ unit.remarks }}</li>
                <li class="t-faded" v-if="unit.rest">
                  Odpoczywaj {{ unit.rest }}s
                </li>
                <li class="t-faded" v-else>Bez odpoczynku</li>
                <li class="unit__feedback" v-if="unit.feedback">
                  {{ unit.feedback }}
                </li>
              </ul>
            </div>
            <aside class="unit__buttons">
              <slot
                name="unit-buttons"
                :unit="unit"
                :unitindex="unitindex"
                :complex="complex"
                :complexindex="complexindex"
              />
            </aside>
          </div>
        </Draggable>
      </section>
    </Draggable>
    <section v-if="section.complexes.length == 0">
      <p class="m00">
        Brak ćwiczeń w tej sekcji.
      </p>
    </section>
  </article>
</template>

<script>
export default {
  props: {
    section: {
      type: Object,
    },
    currentComplex: {
      type: Number,
    },
    editor: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      sectionToModify: this.section,
    };
  },
  methods: {
    setsAndReps(unit) {
      let setsAndReps = unit.sets;
      if (unit.reps) setsAndReps += `x${unit.reps}`;
      if (unit.time) setsAndReps += `x${unit.time}s`;
      if (unit.distance) setsAndReps += `x${unit.distance}m`;
      return setsAndReps;
    },
  },
};
</script>

<style lang="scss" scoped>
.routine {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-bottom: 25px;
}

.routine--expanded {
  min-height: 200px;
  padding-bottom: 60px;
}

.header {
  display: flex;
  justify-content: space-between;
  h3 {
    margin: 0 0 1rem 0;
  }
  button {
    margin-left: 1rem;
  }
  * {
    color: color(headers);
  }
}

.complex__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 4px 0;
}

.complex__header__name {
  color: color(headers);
  margin: 0;
  font-size: 20px;
}

.complex__header__buttons {
  display: flex;
  justify-content: flex-end;
  // margin-left: 1rem;
  button {
    font-size: 14px;
  }
}

.unit {
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.unit__buttons {
  display: flex;
  margin-left: 1rem;
  button,
  a {
    font-size: 14px;
  }
}

.unit__exercise-name {
  margin: 0;
}

.unit__feedback {
  color: #5c946e;
}
</style>
