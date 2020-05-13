<template>
  <article class="routine">
    <section class="header">
      <h3>{{ section.name }}</h3>
      <aside>
        <button class="flaticon-plus" type="button" @click="$emit('copy-section', section)" v-if="copy"></button>
        <slot name="section-buttons"></slot>
      </aside>      
    </section>
    <section 
      :class="{ mb05: complexindex != section.complexes.length - 1, blind: currentComplex != null && currentComplex != complexindex }" 
      v-for="(complex, complexindex) in section.complexes" 
      :key="complexindex">
      <div class="complex" v-if="complex.units.length > 1 || currentComplex == complexindex">
        <h4>{{ complex.name }}</h4>
        <aside>
          <button class="flaticon-plus" type="button" @click="$emit('copy-complex', complex)" v-if="copy"></button>
          <slot name="complex-buttons" :complexindex="complexindex"></slot>
        </aside>
      </div>
      <div class="unit" :class="{ pl05: complex.units.length > 1}" v-for="(unit, unitindex) in complex.units" :key="unitindex">
        <div class="unit-header">
          <p>{{ unit.exercise.name }}</p>
          <aside>
            <button class="flaticon-plus" type="button" @click="$emit('copy-unit', unit)" v-if="copy"></button>
            <nuxt-link class="flaticon-vertical-dots" :to="`/exercises/${unit.exercise.id}`" v-if="view"></nuxt-link>
            <slot name="unit-buttons" :unit="unit" :unitindex="unitindex" :complex="complex" :complexindex="complexindex"></slot>
          </aside>
        </div>
        <ul>
          <li><span v-if="unit.sets">{{ unit.sets }}</span><span v-if="unit.reps">x{{ unit.reps }}</span><span v-if="unit.time">x{{ unit.time }}s</span><span v-if="unit.distance">x{{ unit.distance }}m</span></li>
          <li v-if="unit.remarks">{{ unit.remarks }}</li>
          <li class="t-faded">przerwa {{ unit.rest }}s</li>
        </ul>
      </div>
    </section>
    <section v-if="section.complexes.length == 0">
      <p class="m00">Brak ćwiczeń w tej sekcji.</p>
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
      view: {
        type: Boolean, 
        default: () => false,
      },
      edit: {
        type: Boolean, 
        default: () => false,
      },
      copy: {
        type: Boolean, 
        default: () => false,
      },
    },
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
    margin: 0 0 .5rem 0;
    h4 {
      margin-bottom: 0;
      color: white;
    }
    button {
      margin-left: 1rem;
      font-size: 14px;
    }
  }

  .unit {
    margin-bottom: .5rem;
  }

  .unit-header {
    display: flex;
    justify-content: space-between;
    p {
      margin: 0;
    }
    button, a {
      font-size: 14px;
    }
  }
</style>
