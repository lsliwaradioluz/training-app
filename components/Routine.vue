<template>
  <article class="routine">
    <section class="header">
      <h3>{{ section.name }}</h3>
      <aside>
        <slot name="section-buttons" />
      </aside>
    </section>
    <section
      v-for="(complex, complexindex) in section.complexes"
      :key="complexindex"
      :class="{
        mb05: complexindex != section.complexes.length - 1,
        blind: currentComplex != null && currentComplex != complexindex,
      }"
    >
      <div
        v-if="complex.units.length > 1 || currentComplex == complexindex"
        class="complex"
      >
        <p class="m00">{{ complex.name }}</p>
        <aside>
          <slot
            name="complex-buttons"
            :complex="complex"
            :complexindex="complexindex"
          />
        </aside>
      </div>
      <div
        v-for="(unit, unitindex) in complex.units"
        :key="unitindex"
        class="unit"
        :class="{ pl05: complex.units.length > 1 }"
      >
        <div>
          <p>{{ unit.exercise.name }}</p>
          <ul>
            <li>{{ setsAndReps(unit) }}</li>
            <li v-if="unit.remarks">{{ unit.remarks }}</li>
            <li class="t-faded">przerwa {{ unit.rest }}s</li>
          </ul>
        </div>
        <aside>
          <slot
            name="unit-buttons"
            :unit="unit"
            :unitindex="unitindex"
            :complex="complex"
            :complexindex="complexindex"
          />
        </aside>
      </div>
    </section>
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
  },
  methods: {
    setsAndReps(unit) {
      let setsAndReps = unit.sets;
      if (unit.reps) setsAndReps += `x${unit.reps}`;
      if (unit.time) setsAndReps += `x${unit.time}s`;
      if (unit.distance) setsAndReps += `x${unit.distance}m`;
      return setsAndReps;
    }
  }
}
</script>

<style lang="scss" scoped>
.routine {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 200px;
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

.complex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 4px 0;
  button {
    margin-left: 1rem;
    font-size: 14px;
  }
}

.unit {
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  p {
    margin: 0;
  }
  aside {
    button,
    a {
      font-size: 14px;
      margin-left: 1rem;
    }
  }
}
</style>
