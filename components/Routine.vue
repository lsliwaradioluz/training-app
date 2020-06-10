<template>
  <article class="routine" :class="{ 'routine--expanded': editor }">
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
      <div class="complex">
        <h5 class="complex-name">{{ complex.name }}</h5>
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
      >
        <div>
          <p>{{ unit.exercise.name }}</p>
          <ul>
            <li>{{ setsAndReps(unit) }}</li>
            <li v-if="unit.remarks">{{ unit.remarks }}</li>
            <li class="t-faded" v-if="unit.rest">Odpocznij {{ unit.rest }}s</li>
            <li class="t-faded" v-else>Bez odpoczynku</li>
            <li class="unit__feedback" v-if="unit.feedback">{{ unit.feedback }}</li>
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
    editor: {
      type: Boolean, 
      default: () => false,
    }
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
  padding-bottom: 25px;
}

.routine--expanded {
  padding-bottom: 70px;
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

.complex-name {
  color: color(headers);
  margin: 0;
  font-size: 20px;
}

.unit {
  margin-bottom: 0.5rem;
  padding-left: .5rem;
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

.unit__feedback {
  color: #5C946E;
}
</style>
