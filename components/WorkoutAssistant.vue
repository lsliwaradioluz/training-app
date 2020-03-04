<template>
  <div 
    class="workout-assistant column j-between main pt1 pb0" 
    :class="{ half: dividedScreenMode }" 
    :style="{ backgroundImage: image }">
  <!-- STATUS BAR  -->
    <div class="workout-assistant__bar row j-between a-center">
      <span class="logo">Piti</span>
      <h3 class="m00 t-center" v-if="!dividedScreenMode">{{ sections[controllers.section].name | shortenSection }}</h3>
      <p class="m00 t-center" v-else>{{ workout.user.fullname | getName }}: {{ sections[controllers.section].name | shortenSection }}</p>
      <span class="hamburger t-right">
        <i class="flaticon-cancel small" @click="$router.go(-1)"></i>
      </span>
    </div>
    <div>
    <!-- STOPER -->
      <transition name="slide-up">
        <Stopwatch v-if="showStopwatch" />
      </transition>
    <!-- ĆWICZENIE -->
      <div class="workout-assistant__exercise pt1 pb1 row a-center" :class="{ grow: dividedScreenMode }" v-if="current.exercise.name != 'Odpoczynek'">
        <div>
          <MovingText :key="current.exercise.name">
            <h3 class="m00">{{ current.exercise.name }}</h3>
          </MovingText>
          <MovingText :key="current.remarks" v-if="current.remarks">
            <p class="t-small m00">{{ current.remarks }}</p>
          </MovingText>
          <p class="t-small m00" v-else>Wykonaj teraz</p>
        </div>
        <div class="row a-center j-end pl1">
          <p class="m00 fs-2" v-if="current.reps">{{ current.reps }}</p>
          <p class="m00 fs-2" v-if="current.reps && current.time"><span class="fs-15">x</span>{{ current.time }}<span class="fs-15">s</span></p>
          <p class="m00 fs-2" v-if="current.time && !current.reps">{{ current.time }}s</p>
          <p class="m00 t-right fs-2" v-if="current.distance">{{ current.distance }}<span class="fs-15">m</span></p>
        </div>
      </div>
    <!--  -->
      <Timer :class="{ grow: dividedScreenMode }" :time="current.time" :next="next" @countdown-over="nextUnit" v-else />
      <div class="workout-assistant__indicators">
        <p class="m00 t-small">{{ `Blok ${controllers.complex + 1 }/${ sections[controllers.section].complexes.length}` }}</p>
        <div class="row">
          <span v-for="n in units.length" :key="n" :class="{ 'b-white': n <= controllers.unit + 1 }"></span>
        </div>
      </div>
      <div class="workout-assistant__buttons row j-between a-center pt1 pb1">
        <i class="flaticon-past small"></i>
        <i class="flaticon-previous-track-button" @click="previousUnit"></i>
        <i class="flaticon-check" @click="nextUnit"></i>
        <i class="flaticon-play-and-pause-button" @click="nextUnit"></i>
        <i class="flaticon-clock small" @click="showStopwatch = !showStopwatch"></i>
      </div>
      <p class="mt0 mb1 t-gray t-center t-small" v-if="!dividedScreenMode">Inspired by Spotify</p>
    </div>
  </div>
</template>

<script>
import Timer from '~/components/Timer';
import Stopwatch from '~/components/Stopwatch';
import MovingText from '~/components/MovingText';

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
    MovingText,
  },
  data() {
    return {
      sections: this.workout.sections,
      controllers: this.$store.state.main.workoutAssistantState[this.workout.id] ? { ...this.$store.state.main.workoutAssistantState[this.workout.id] } : {
        section: this.$route.query.section,
        complex: 0, 
        unit: 0,
      }, 
      showStopwatch: false,
    }
  },
  methods: {
    nextUnit() {
      this.controllers.unit++;
      if (this.controllers.unit > this.units.length - 1) {
        this.nextComplex();
      }
      this.$emit('set-current-state', { 
        unit: this.controllers.unit, complex: this.controllers.complex, section: this.controllers.section 
      });
    },
    previousUnit() {
      this.controllers.unit--;
      if (this.controllers.unit < 0) {
        this.previousComplex();
      }
      this.$emit('set-current-state', { 
        unit: this.controllers.unit, 
        complex: this.controllers.complex, 
        section: this.controllers.section 
      });
    },
    nextComplex() {
      this.controllers.complex++;
      if (this.controllers.complex > this.sections[this.controllers.section].complexes.length - 1) {
        this.nextSection();
      } else {
        this.controllers.unit = 0;
      }
    },
    previousComplex() {
      this.controllers.complex--
      if (this.controllers.complex < 0) {
        this.previousSection();
      } else {
        this.controllers.unit = this.units.length - 1;
      }
    },
    nextSection() {
      this.controllers.section++;
      if (this.controllers.section > this.sections.length - 1) {
        this.controllers.section = this.sections.length - 1;
        this.controllers.complex = this.sections[this.controllers.section].complexes.length - 1;
        this.controllers.unit = this.units.length - 1;
      } else {
        this.controllers.unit = 0;
        this.controllers.complex = 0;
      }
    },
    previousSection() {
      this.controllers.section--;
      if (this.controllers.section < 0) {
        this.controllers.complex = 0;
        this.controllers.unit = 0;
        this.controllers.section = 0;
      } else {
        this.controllers.complex = this.sections[this.controllers.section].complexes.length - 1;
        this.controllers.unit = this.units.length - 1;
      }
    },
  },
  computed: {
    image() {
      let image; 
      if (this.current.exercise.name == 'Odpoczynek' ) {
        image = this.next.exercise.images.length > 0 ? this.next.exercise.images[0].url : 'https://media.giphy.com/media/fdlcvptCs4qsM/giphy.gif';
      } else {
        image = this.current.exercise.images.length > 0 ? this.current.exercise.images[0].url : 'https://media.giphy.com/media/e2nYWcTk0s8TK/giphy.gif';
      }

      if (!this.dividedScreenMode) {
        return `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${image}')`;
      } else {
        return 'none';
      }
    },
    current() {
      return this.units[this.controllers.unit];
    },
    next() {
      let next = this.units[this.controllers.unit + 1];
      
      if (this.controllers.unit + 1 > this.units.length - 1) {
        next = { exercise: { name: 'Odpocznij', images: [] } }
      }

      return next;
    },
    units() {
      let units = [];

      // Get array of arrays containing all sets of a given exercise
      // IE: 3x8 e1, 3x6 e2
      // => [[e1, e1, e1], [e2, e2, e2]]
      this.sections[this.controllers.section].complexes[this.controllers.complex].units.forEach((unit, unitindex) => {
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
        
        if (i % 2 != 0 && this.sections[this.controllers.section].rest > 0) {
          let rest;
          if (i == units.length) {
            rest = this.sections[this.controllers.section].rest;
          } else if (units[i-1].exercise.name == units[i].exercise.name) {
            rest = this.sections[this.controllers.section].rest;
          } else {
            rest = Math.floor(this.sections[this.controllers.section].rest / 2);
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
    background-size: cover;
    background-position: center;
  }

  .workout-assistant__bar {
    width: 100%;
    background-color: color(black);
    width: 100%;
    background: transparent;

    span {
      width: 20%;
    }
    h3 {
      text-transform: capitalize;
      width: 60%;
    }
  }

  .workout-assistant__exercise {
    div:first-child {
      width: 70%;
    }
    div:nth-child(2) {
      width: 30%;
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

  .workout-assistant__indicators {
    span {
      height: 2px;
      flex: 1;
      background: color(gray);
      margin-right: 1px;
    }
    span:last-child {
      margin: 0;
    }
  }

  .flaticon-check:before {
    font-size: 3rem;
  }
</style>