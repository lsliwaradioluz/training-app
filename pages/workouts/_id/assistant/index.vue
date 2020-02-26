<template>
  <div class="workout-assistant column main pb2">
  <!-- STATUS BAR  -->
    <div class="workout-assistant__bar main pt1 pb1 row j-center a-center">
      <span class="logo">Piti</span>
      <h3 class="m00 t-center">{{ sections[currentSection].name | shortenSection }}</h3>
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
    <div v-if="current.exercise.name != 'Odpoczynek'">
      <div class="tab row j-between a-center">
        <div>
          <h3 class="m00">{{ current.exercise.name }}</h3>
          <p class="t-small m00" v-if="current.remarks">{{ current.remarks }}</p>
          <p class="t-small m00" v-else>Wykonaj teraz</p>
        </div>
        <div class="row a-center">
          <p class="m00 t-right fs-2" v-if="current.reps">{{ current.reps}}</p>
          <div v-if="current.reps && current.time">
            <p>x</p>
            <p class="m00 t-right fs-2" v-if="current.time">{{ current.time }}s</p>
          </div>
          <Stopwatch :time="10" v-if="current.time && !current.reps" />
          <p class="m00 t-right fs-2" v-if="current.distance">{{ current.time }}m</p>
        </div>
      </div>
    </div>
  <!--  -->
    <Timer :time="current.time" :next="next" v-else />
    <img class="square" src="https://media.giphy.com/media/SKAQ4kWov6tdC/giphy.gif" alt="exercise">
    <div class="workout-assistant__buttons row j-between mt05">
      <button class="button--primary square" type="button" @click="nextExercise" v-if="current.exercise.name == 'Odpoczynek'">Przejdź do {{ next.exercise.name }}</button>
      <button class="button--primary square" type="button" @click="nextExercise" v-else>Zrobione!</button>
    </div>
  </div>
</template>

<script>
import mainQuery from '~/apollo/queries/workouts/_id/assistant/main.gql';
import Timer from '~/components/Timer';
import Stopwatch from '~/components/Stopwatch';

export default {
  layout: 'assistant',
  components: {
    Timer,
    Stopwatch,
  },
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    return client.query({ query: mainQuery, variables: { id: context.route.params.id } })
      .then(({ data }) => { 
        
        const sections = data.workout.sections.filter(section => {
          return section.complexes.length > 0;
        });     
        
        return {
          sections: sections
        }
      });
  },
  data() {
    return {
      currentSection: this.$route.query.section,
      currentComplex: 0, 
      currentExercise: 0,
      showStopwatch: false,
    }
  },
  methods: {
    nextExercise() {
      this.currentExercise++;
      if (this.currentExercise > this.sets[this.currentComplex].length - 1) {
        this.currentComplex++;
        if (this.currentComplex > this.sets.length - 1) {
          this.currentComplex = this.sets.length - 1;
          this.currentExercise = this.sets[this.currentComplex].length - 1; 
        } else {
          this.currentExercise = 0;
        }
      }
    }, 
    previousExercise() {
      this.currentExercise--;
      if (this.currentExercise < 0) {
        this.currentComplex--;
        if (this.currentComplex < 0) {
          this.currentComplex = 0;
          this.currentExercise = 0;
        } else {
          this.currentExercise = this.sets[this.currentComplex].length - 1;
        }
      } 
    },
    nextComplex() {
      this.currentComplex++;
      if (this.currentComplex > this.sets.length - 1) { 
        this.currentComplex = this.sets.length - 1;
      } else {
        this.currentExercise = 0;
      }
    },
    previousComplex() {
      this.currentComplex--;
      if (this.currentComplex < 0) {
        this.currentComplex = 0;
      } else {
        this.currentExercise = 0;
      }
    },
    nextSection() {
      this.currentSection++;
      if (this.currentSection > this.sections.length - 1) {
        this.currentSection = this.sections.length - 1;
      } else {
        this.currentExercise = 0;
        this.currentComplex = 0;
      }
    },
    previousSection() {
      this.currentSection--;
      if (this.currentSection < 0) {
        this.currentSection = 0;
      } else {
        this.currentExercise = 0;
        this.currentComplex = 0;
      }
    },
    closeAssistant() {
      if (confirm("Czy na pewno chcesz wyłączyć asystenta?")) {
        this.$emit('close-assistant');
      }
    }
  },
  computed: {
    navigationPanels() {
      const navigationPanels = [
        {
          caption: this.sections[this.currentSection].name, 
          nextFunction: this.nextSection, 
          previousFunction: this.previousSection,
        },
        {
          caption: `Seria ${this.currentExercise + 1 }/${ this.sets[this.currentComplex].length}`, 
          nextFunction: this.nextExercise, 
          previousFunction: this.previousExercise,
        },
        {
          caption: `Kompleks ${this.currentComplex + 1 }/${ this.sets.length}`, 
          nextFunction: this.nextComplex, 
          previousFunction: this.previousComplex,
        }
      ]
      return navigationPanels;
    },
    current() {
      return this.sets[this.currentComplex][this.currentExercise];
    },
    next() {
      let currentComplex = this.currentComplex;
      let currentExercise = this.currentExercise + 1;
      
      if (currentExercise > this.sets[currentComplex].length - 1) {
        currentComplex++;
        if (this.currentComplex > this.sets.length - 1) {
          currentComplex = this.sets.length - 1;
          currentExercise = this.sets[currentComplex].length - 1; 
        } else {
          currentExercise = 0;
        }
      }

      return this.sets[currentComplex][currentExercise];
    },
    realSets() {
      const realSets = this.sets[this.currentComplex].filter(set => {
        return set.exercise.name != 'Odpoczynek';
      });

      return realSets;
    },
    realCurrentExercise() {
      return this.currentExercise / 2.1;
    },
    sets() {
      let workout = []; 
      this.sections[this.currentSection].complexes.forEach((complex, complexindex) => {
        let sets = [];
        this.sections[this.currentSection].complexes[complexindex].units.forEach((unit, unitindex) => {
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

      for (let i = 0; i <= workout.length - 1; i++) {
        if (i % 2 != 0) {
          workout.splice(i, 0, [{ exercise: { name: 'Odpoczynek' }, time: this.sections[this.currentSection].rest }]);
        }
      }

      return workout;
    }
  }
}
</script>

<style lang="scss" scoped>

  .workout-assistant {
    height: 100vh;
  }

  .workout-assistant__bar {
    width: 100%;
    background-color: color(black);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;

    span {
      width: 20%;
    }
    h3 {
      text-transform: capitalize;
      width: 60%;
    }
  }


    img {
      flex-grow: 1;
      width: 100%;
    }


  .workout-assistant__buttons {
    button {
      width: 100%;
    }
  }
</style>