<template>
  <div class="workout-assistant column main pt1 pb1" :class="{ half: dividedScreenMode }">
  <!-- STATUS BAR  -->
    <div class="workout-assistant__bar pb1 row j-between a-center">
      <span class="logo">Piti</span>
      <h3 class="m00 t-center" v-if="!dividedScreenMode">{{ sections[currentSection].name | shortenSection }}</h3>
      <p class="m00 t-center" v-else>{{ workout.user.fullname | getName }}: {{ sections[currentSection].name | shortenSection }}</p>
      <span class="hamburger t-right">
        <i class="flaticon-pause" @click="closeAssistant"></i>
      </span>
    </div>
  <!-- NAWIGACJA -->
    <div class="row j-between a-center tab pt05 pb05 b-green t-black">
      <i class="flaticon-left-arrow small" @click="previousUnit"></i>
      <p class="m00">{{ `Blok ${this.currentComplex + 1 }/${ this.sections[this.currentSection].complexes.length } Seria ${this.currentUnit + 1 }/${ this.units.length }` }}</p>
      <i class="flaticon-right-arrow small" @click="nextUnit"></i>
    </div>
  <!-- ĆWICZENIE -->
    <div class="tab row j-between a-center" :class="{ grow: dividedScreenMode }" v-if="current.exercise.name != 'Odpoczynek'">
      <div>
        <h3 class="m00">{{ current.exercise.name }}</h3>
        <p class="t-small m00" v-if="current.remarks">{{ current.remarks }}</p>
        <p class="t-small m00" v-else>Wykonaj teraz</p>
      </div>
      <div class="row a-center pl1">
        <!-- <p class="m00 fs-2">{{ current.reps }}<span class="fs-15">x</span>{{ current.time }}<span class="fs-15">s</span></p> -->
        <p class="m00 fs-2" v-if="current.reps">{{ current.reps }}</p>
        <p class="m00 fs-2" v-if="current.reps && current.time"><span class="fs-15">x</span>{{ current.time }}<span class="fs-15">s</span></p>
        <Stopwatch :time="current.time" v-if="current.time && !current.reps" />
        <p class="m00 t-right fs-2" v-if="current.distance">{{ current.distance }}<span class="fs-15">m</span></p>
      </div>
    </div>
  <!--  -->
    <Timer :class="{ grow: dividedScreenMode }" :time="current.time" :next="next" @countdown-over="nextUnit" v-else />
    <img class="square grow mb05" :src="image" alt="exercise" v-if="!dividedScreenMode">
    <div class="workout-assistant__buttons row j-between">
      <button class="button--primary square" type="button" @click="nextUnit" v-if="current.exercise.name == 'Odpoczynek'">Następne ćwiczenie</button>
      <button class="button--primary square" type="button" @click="nextUnit" v-else>Zrobione!</button>
    </div>
  </div>
</template>

<script>
import Timer from '~/components/Timer';
import Stopwatch from '~/components/Stopwatch';
export default {
  props: {
    workout: {
      type: Object, 
    }, 
    dividedScreenMode: {
      type: Boolean, 
      default: () => true
    },
  },
  components: {
    Timer,
    Stopwatch,
  },
  data() {
    return {
      sections: this.workout.sections,
      currentSection: this.$route.query.section,
      currentComplex: 0, 
      currentUnit: 0,
    }
  },
  methods: {
    nextUnit() {
      this.currentUnit++;
      if (this.currentUnit > this.units.length - 1) {
        this.nextComplex();
      }
    },
    previousUnit() {
      this.currentUnit--;
      if (this.currentUnit < 0) {
        this.previousComplex();
      }
    },
    nextComplex() {
      this.currentComplex++;
      if (this.currentComplex > this.sections[this.currentSection].complexes.length - 1) {
        this.nextSection();
      } else {
        this.currentUnit = 0;
      }
    },
    previousComplex() {
      this.currentComplex--
      if (this.currentComplex < 0) {
        this.previousSection();
      } else {
        this.currentUnit = this.units.length - 1;
      }
    },
    nextSection() {
      this.currentSection++;
      if (this.currentSection > this.sections.length - 1) {
        this.currentSection = this.sections.length - 1;
        this.currentComplex = this.sections[this.currentSection].complexes.length - 1;
        this.currentUnit = this.units.length - 1;
      } else {
        this.currentUnit = 0;
        this.currentComplex = 0;
      }
    },
    previousSection() {
      this.currentSection--;
      if (this.currentSection < 0) {
        this.currentComplex = 0;
        this.currentUnit = 0;
        this.currentSection = 0;
      } else {
        this.currentComplex = this.sections[this.currentSection].complexes.length - 1;
        this.currentUnit = this.units.length - 1;
      }
    },
    closeAssistant() {
      if (confirm("Czy na pewno chcesz wyłączyć asystenta?")) {
        this.$router.go(-1);
      }
    }
  },
  computed: {
    image() {
      if (this.current.exercise.name == 'Odpoczynek' ) {
        return this.next.exercise.images.length > 0 ? this.next.exercise.images[0].url : 'https://media.giphy.com/media/fdlcvptCs4qsM/giphy.gif';
      } else {
        return this.current.exercise.images.length > 0 ? this.current.exercise.images[0].url : 'https://media.giphy.com/media/e2nYWcTk0s8TK/giphy.gif';
      }
    },
    current() {
      return this.units[this.currentUnit];
    },
    next() {
      let next = this.units[this.currentUnit + 1];
      
      if (this.currentUnit + 1 > this.units.length - 1) {
        next = { exercise: { name: 'Odpocznij', images: [] } }
      }

      return next;
    },
    units() {
      let units = [];

      // Get array of arrays containing all sets of a given exercise
      // IE: 3x8 e1, 3x6 e2
      // => [[e1, e1, e1], [e2, e2, e2]]
      this.sections[this.currentSection].complexes[this.currentComplex].units.forEach((unit, unitindex) => {
        const groupedUnits = [];
        for (let x = 0; x < unit.sets; x++) {
          groupedUnits.push(unit)
        }
        units.push(groupedUnits);
      });

      // Sort arrays pushing the longest to the front
      // [[e1, e1, e1], [e2, e2, e2, e2]] 
      // => [[e2, e2, e2, e2], [e1, e1, e1]]
      units = units.sort((a, b) => {
        return b.length - a.length
      });

      // Zip the exercises creating two arrays 
      // [[e2, e2, e2, e2], [e1, e1, e1]]
      // => [[e2, e1], [e2, e1], [e2, e1], [e2, undefined]]
      units = _.zip(...units);

      // Flatten the main array, removing nested arrays
      // [[e2, e1], [e2, e1], [e2, e1], [e2, undefined]]
      // => [e2, e1, e2, e1, e2, e1, e2, undefined]
      units = _.flattenDeep(units);

      // Filter the array to remove undefined if exists
      units = units.filter(unit => {
        return unit != undefined;
      })

      // Add the rest intervals if there should be any
      for (let i = 0; i <= units.length; i++) {
        
        if (i % 2 != 0 && this.sections[this.currentSection].rest > 0) {
          let rest;
          if (i == units.length) {
            rest = this.sections[this.currentSection].rest;
          } else if (units[i-1].exercise.name == units[i].exercise.name) {
            rest = this.sections[this.currentSection].rest;
          } else {
            rest = Math.floor(this.sections[this.currentSection].rest / 2);
          }
          units.splice(i, 0, { exercise: { name: 'Odpoczynek' }, time: rest });
        }
      }

      return units;
    }
  }
}
</script>

<style lang="scss" scoped>

  .workout-assistant {
    height: 100%;
  }

  .workout-assistant__bar {
    width: 100%;
    background-color: color(black);
    width: 100%;

    span {
      width: 20%;
    }
    h3 {
      text-transform: capitalize;
      width: 60%;
    }
  }

  .grow {
    flex-grow: 1;
  }

  img {
    width: 100%;
  }

  .workout-assistant__buttons {
    button {
      width: 100%;
    }
  }

  .half {
    height: 50%;
  }
</style>