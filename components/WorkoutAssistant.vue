<template>
  <div class="workout-assistant column main pt1 pb1" :class="{ half: dividedScreenMode }">
  <!-- STATUS BAR  -->
    <div class="workout-assistant__bar pb1 row j-center a-center">
      <span class="logo">Piti</span>
      <h3 class="m00 t-center" v-if="!dividedScreenMode">{{ sections[currentSection].name | shortenSection }}</h3>
      <h3 class="m00 t-center" v-else>{{ workout.user.username }}</h3>
      <span class="hamburger t-right">
        <i class="flaticon-pause" @click="closeAssistant"></i>
      </span>
    </div>
  <!-- NAWIGACJA -->
    <Carousel :pagination="false" :start-from-page="1">
      <div class="row j-between a-center tab pt05 pb05 b-green t-black" v-for="(panel, index) in navigationPanels" :key="index">
        <i class="flaticon-left-arrow small" @click="panel.previousFunction"></i>
        <p class="m00">{{ panel.caption }}</p>
        <i class="flaticon-right-arrow small" @click="panel.nextFunction"></i>
      </div>
    </Carousel>
  <!-- ĆWICZENIE -->
    <div class="tab row j-between a-center" :class="{ grow: dividedScreenMode }" v-if="current.exercise.name != 'Odpoczynek'">
      <div>
        <h3 class="m00">{{ current.exercise.name }}</h3>
        <p class="t-small m00" v-if="current.remarks">{{ current.remarks }}</p>
        <p class="t-small m00" v-else>Wykonaj teraz</p>
      </div>
      <div class="row a-center">
        <p class="m00 t-right fs-2" v-if="current.reps">{{ current.reps }}</p>
        <div class="row" v-if="current.reps && current.time">
          <p class="m00 row a-end">x</p>
          <p class="m00 t-right fs-2" v-if="current.time">{{ current.time }}<span class="t-small">s</span></p>
        </div>
        <Stopwatch :time="10" v-if="current.time && !current.reps" />
        <p class="m00 t-right fs-2" v-if="current.distance">{{ current.distance }}<span class="t-small">m</span></p>
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
      if (this.currentUnit > this.sets[this.currentComplex].length - 1) {
        this.currentComplex++;
        if (this.currentComplex > this.sets.length - 1) {
          this.currentComplex = this.sets.length - 1;
          this.currentUnit = this.sets[this.currentComplex].length - 1; 
        } else {
          this.currentUnit = 0;
        }
      }
    }, 
    previousUnit() {
      this.currentUnit--;
      if (this.currentUnit < 0) {
        this.currentComplex--;
        if (this.currentComplex < 0) {
          this.currentComplex = 0;
          this.currentUnit = 0;
        } else {
          this.currentUnit = this.sets[this.currentComplex].length - 1;
        }
      } 
    },
    nextSection() {
      this.currentSection++;
      if (this.currentSection > this.sections.length - 1) {
        this.currentSection = this.sections.length - 1;
      } else {
        this.currentUnit = 0;
        this.currentComplex = 0;
      }
    },
    previousSection() {
      this.currentSection--;
      if (this.currentSection < 0) {
        this.currentSection = 0;
      } else {
        this.currentUnit = 0;
        this.currentComplex = 0;
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
      if (this.current.exercise.name == 'Odpoczynek') {
        return this.next.exercise.images.length > 0 ? this.next.exercise.images[0].url : 'https://media.giphy.com/media/fdlcvptCs4qsM/giphy.gif';
      } else {
        return this.current.exercise.images.length > 0 ? this.current.exercise.images[0].url : 'https://media.giphy.com/media/e2nYWcTk0s8TK/giphy.gif';
      }
    },
    navigationPanels() {
      const navigationPanels = [
        {
          caption: this.sections[this.currentSection].name, 
          nextFunction: this.nextSection, 
          previousFunction: this.previousSection,
        },
        {
          caption: `Blok ${this.currentComplex + 1 }/${ this.sets.length } Seria ${this.currentUnit + 1 }/${ this.sets[this.currentComplex].length}`, 
          nextFunction: this.nextUnit, 
          previousFunction: this.previousUnit,
        }
      ]
      return navigationPanels;
    },
    current() {
      return this.sets[this.currentComplex][this.currentUnit];
    },
    next() {
      let currentComplex = this.currentComplex;
      let currentUnit = this.currentUnit + 1;
      
      if (currentUnit > this.sets[currentComplex].length - 1) {
        currentComplex++;
        if (this.currentComplex > this.sets.length - 1) {
          currentComplex = this.sets.length - 1;
          currentUnit = this.sets[currentComplex].length - 1; 
        } else {
          currentUnit = 0;
        }
      }

      return this.sets[currentComplex][currentUnit];
    },
    sets() {
      let workout = []; 
      this.sections[this.currentSection].complexes.forEach((complex, complexindex) => {
        let sets = [];
        complex.units.forEach((unit, unitindex) => {
          const complexes = [];
          for (let x = 0; x < unit.sets; x++) {
            complexes.push(unit)
          }
          sets.push(complexes);
        });
        sets = sets.sort((a, b) => {
          return b.length - a.length
        });

        // Here we zip the sets to make A-B-A-B etc. structure
        const zippedSets = _.zip(...sets);
        const flattenedSets = _.flattenDeep(zippedSets);
        const filteredSets = flattenedSets.filter(element => {
          return element != undefined;
        });

        // Add rest intervals if should be any
  
        for (let i = 0; i <= filteredSets.length - 1; i++) {
          if (i % 2 != 0) {
            let rest;
            if (filteredSets[i-1].exercise.name == filteredSets[i].exercise.name) {
              rest = this.sections[this.currentSection].rest;
            } else {
              rest = Math.floor(this.sections[this.currentSection].rest / 2);
            }
            filteredSets.splice(i, 0, { exercise: { name: 'Odpoczynek' }, time: rest });
          }
        }
        workout.push(filteredSets);
      });

      return workout;
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