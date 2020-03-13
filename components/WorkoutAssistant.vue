<template>
  <div 
    class="workout-assistant column j-end main pt1 pb0" 
    :class="{ half: isScreenDivided }"
    :style="{ backgroundImage: image }"
    @click.self="nextUnit">
  <!-- STATUS BAR  -->
    <div class="workout-assistant__bar row j-between a-center main pb1 pt1">
      <span class="logo">Piti</span>
      <h3 class="m00 t-center" v-if="!isScreenDivided">{{ sections[controllers.section].name | shortenSection }}</h3>
      <p class="m00 t-center" v-else>{{ workout.user.fullname | getName }}: {{ sections[controllers.section].name | shortenSection }}</p>
      <span class="hamburger t-right">
        <i class="flaticon-cancel small" @click="$router.go(-1)"></i>
      </span>
    </div>
    <div>
  <!-- MODAL INFO  -->
      <transition name="slide-to-right">
        <div class="t-small" v-show="showInfoModal">
          {{ infoModalMessage }}
        </div>
      </transition>
  <!-- STOPER -->
      <transition name="slide-to-right">
        <Stopwatch v-if="showStopwatch" />
      </transition>
  <!-- ROZPISKA OBECNEGO BLOKU -->
      <div class="workout-assistant__complex-tab main" v-if="showWholeComplex">
        <div class="workout-assistant__bar row j-between a-center main pb1 pt1 b-assistantblack">
          <span class="logo">Piti</span>
          <h3 class="m00 t-center">Rozpiska</h3>
          <span class="hamburger t-right">
            <i class="flaticon-cancel small" @click="showWholeComplex = false"></i>
          </span>
        </div>
        <div>
          <div 
            class="mb1 row j-between" 
            v-for="(unit, index) in sections[controllers.section].complexes[controllers.complex].units" 
            :key="index">
            <ul>
              <p class="m00">{{ unit.exercise.name }}</p>
              <li><span v-if="unit.sets">{{ unit.sets }}</span><span v-if="unit.reps">x{{ unit.reps }}</span><span v-if="unit.time">x{{ unit.time }}s</span><span v-if="unit.distance">x{{ unit.distance }}m</span></li>
              <li v-if="unit.remarks">{{ unit.remarks }}</li>
              <li>przerwy {{ unit.rest }}s</li>
            </ul>
            <nuxt-link
              :to="`/exercises/${unit.exercise.id}`" 
              tag="i"
              class="flaticon-information small ml1"></nuxt-link>
          </div>
        </div>
      </div>
  <!-- ĆWICZENIE -->
      <div class="workout-assistant__exercise pt1 pb1 row a-start j-between" :class="{ grow: isScreenDivided }">
        <div class="left">
          <MovingText :key="current.exercise.name">
            <h3 class="m00">{{ current.exercise.name }}</h3>
          </MovingText>
          <p class="t-small m00" v-if="current.remarks">{{ current.remarks }}</p>
          <p class="t-small m00" v-else>Wykonaj teraz</p>
          <p class="t-small m00" v-if="lastSet">ostatnia seria</p>
        </div>
        <Timer 
          :time="current.time"
          :bell="current.exercise.name != 'Odpocznij'"
          :mute="voiceAssistantSpeaking || voiceAssistantMode == 'off'"
          @countdown-over="nextUnit" 
          :key="controllers.unit"
          v-if="!current.sets && current.time || automaticModeOn && current.time && !current.reps" />
        <div class="right row a-center j-end pl1" v-else>
          <p class="m00 fs-2" v-if="current.reps">{{ current.reps }}</p>
          <p class="m00 fs-2" v-if="current.reps && current.time"><span class="fs-15">x</span>{{ current.time }}<span class="fs-15">s</span></p>
          <p class="m00 fs-2" v-if="current.time && !current.reps">{{ current.time }}s</p>
          <p class="m00 t-right fs-2" v-if="current.distance">{{ current.distance }}<span class="fs-15">m</span></p>
        </div>
      </div>
      <div class="workout-assistant__indicators" >
        <p class="m00 t-small">
          {{ `Blok ${controllers.complex + 1 }/${ sections[controllers.section].complexes.length}` }}
        </p>
        <div class="row j-between">
          <span 
            class="workout-assistant__indicators-bar t-center"
            :class="{ 'b-white': index <= controllers.unit }"
            v-for="(unit, index) in units" 
            :key="index" 
            @click="controllers.unit = index"></span>
        </div>
      </div>
      <div class="workout-assistant__buttons row j-between a-center pt1 pb1">
        <span>
          <i class="flaticon-sound small" @click="voiceAssistantMode = 'half-on'" v-if="voiceAssistantMode == 'on'"></i>
          <i class="flaticon-speaker small" @click="voiceAssistantMode = 'off'" v-else-if="voiceAssistantMode == 'half-on'"></i>
          <i class="flaticon-mute small" @click="voiceAssistantMode = 'on'" v-else></i>
        </span>
        <i class="flaticon-login small" :class="{ 't-green': automaticModeOn }" @click="toggleAutomaticMode"></i>
        <i class="flaticon-previous-track-button" @click="previousUnit"></i>
        <i class="flaticon-play-and-pause-button" @click="nextUnit"></i>
        <i class="flaticon-clock small" :class="{ 't-green': showStopwatch }" @click="showStopwatch = !showStopwatch"></i>
        <i class="flaticon-menu-1 small" @click="showWholeComplex = true"></i>
      </div>
      <VoiceAssistant 
        :soundname="current.soundname || 'wykonaj-ćwiczenie.mp3'" 
        :key="current.soundname"
        @playing="voiceAssistantSpeaking = true" 
        @ended="voiceAssistantSpeaking = false"
        v-if="voiceAssistantMode == 'on' && !current.time || voiceAssistantMode == 'on' && current.time > 20" />
    </div>
  </div>
</template>

<script>
import Timer from '~/components/Timer';
import Stopwatch from '~/components/Stopwatch';
import MovingText from '~/components/MovingText';
import VoiceAssistant from '~/components/VoiceAssistant';

export default {
  props: {
    workout: {
      type: Object, 
    }, 
    isScreenDivided: {
      type: Boolean, 
      default: () => true
    },
  },
  components: {
    Timer,
    Stopwatch,
    MovingText,
    VoiceAssistant,
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
      automaticModeOn: false,
      voiceAssistantMode: 'on',
      voiceAssistantSpeaking: true, 
      showInfoModal: false,
      infoModalMessage: null,
      infoModalTimeout: null,
      showWholeComplex: this.cameBackFromExercise,
    }
  },
  watch: {
    voiceAssistantMode() {
      clearTimeout(this.infoModalTimeout);
      this.showInfoModal = true;
      switch (this.voiceAssistantMode) {
        case 'on':
          this.infoModalMessage = 'Asystent w trybie: full';
          break;
        case 'half-on':
          this.infoModalMessage = 'Asystent w trybie: half';
          break;
        case 'off':
          this.infoModalMessage = 'Asystent w trybie: off'; 
      }
      this.infoModalTimeout = setTimeout(() => {
        this.showInfoModal = false;
      }, 2000);
    },
    automaticModeOn() {
      clearTimeout(this.infoModalTimeout);
      this.showInfoModal = true;
      this.infoModalMessage = this.automaticModeOn ? 'Tryb automatyczny włączony' : 'Tryb automatyczny wyłączony';
      this.infoModalTimeout = setTimeout(() => {
        this.showInfoModal = false;
      }, 2000);
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
    toggleAutomaticMode() {
      this.automaticModeOn = !this.automaticModeOn;
      if (this.automaticModeOn) {
        this.showInfoModal = true;
        setTimeout(() => {
          this.showInfoModal = false;
        }, 2000);
      } else {
        this.showInfoModal = false;
      }
    }
  },
  computed: {
    image() {
      let image; 
      if (this.current.exercise.name == 'Odpocznij') {
        image = this.next.exercise.images.length > 0 ? this.next.exercise.images[0].url : 'https://media.giphy.com/media/fdlcvptCs4qsM/giphy.gif';
      } else if (this.current.exercise.name == 'Rozpoczynasz nowy blok' || this.current.exercise.name == 'Witaj w cyfrowym asystencie treningu!') {
        image = 'https://media.giphy.com/media/e2nYWcTk0s8TK/giphy.gif';
      } else if (this.current.exercise.name == 'Ukończyłeś blok' || this.current.exercise.name == 'Ukończyłeś sekcję' || this.current.exercise.name == 'Ukończyłeś trening') {
        image = 'https://media.giphy.com/media/fdlcvptCs4qsM/giphy.gif';
      } else {
        image = this.current.exercise.images.length > 0 ? this.current.exercise.images[0].url : 'https://media.giphy.com/media/e2nYWcTk0s8TK/giphy.gif';
      }

      if (!this.isScreenDivided) {
        return `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${image}')`;
      } else {
        return 'none';
      }
    },
    current() {
      return this.units[this.controllers.unit];
    },
    lastSet() {
      const lastIndex = this.units.lastIndexOf(this.units[this.controllers.unit]);
      if (lastIndex == this.controllers.unit && this.units[this.controllers.unit].exercise.name != 'Za chwilę:' && this.units[this.controllers.unit].sets > 1) {
        return true;
      } else {
        return false;
      }
    },
    next() {
      let next = this.units[this.controllers.unit + 1];
      
      if (this.controllers.unit + 1 > this.units.length - 1) {
        next = { exercise: { name: 'Kolejny blok', images: [] } }
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
      });

      // Add the rest intervals if there should be any
      for (let i = 0; i <= units.length - 1; i++) {
        let rest = units[i].rest;
        if (rest > 0 && i < units.length - 1) {
          let remarks; 
          if (units[i+1].reps) {
            remarks = `Następnie: ${units[i+1].reps} ${units[i+1].exercise.name}`;
          } else if (units[i+1].time) {
            remarks = `Następnie: ${units[i+1].time}s ${units[i+1].exercise.name}`;
          } else if (units[i+1].distance) {
            remarks = `Następnie: ${units[i+1].distance}m ${units[i+1].exercise.name}`;
          }

          units.splice(i+1, 0, { 
            exercise: { 
              name: 'Odpocznij' 
            }, 
            time: rest, 
            remarks: remarks,
            soundname: 'odpocznij.mp3'
          });
        } else if (rest > 0 && i == units.length - 1) {
          let name, remarks, soundname; 

          if (this.controllers.complex < this.sections[this.controllers.section].complexes.length - 1) {
            name = 'Ukończyłeś blok';
            remarks = 'Odpocznij i przejdź do kolejnego';
            soundname = 'blok-zakonczony.mp3';
          } else if (this.controllers.complex == this.sections[this.controllers.section].complexes.length - 1 && this.controllers.section < this.sections.length - 1) {
            name = 'Ukończyłeś sekcję';
            remarks = 'Odpocznij i przejdź do kolejnej';
            soundname = 'sekcja-zakończona.mp3';
          } else if (this.controllers.complex == this.sections[this.controllers.section].complexes.length - 1 && this.controllers.section == this.sections.length - 1) {
            name = 'Ukończyłeś trening';
            remarks = 'Daj znać trenerowi, jak poszło!';
            soundname = 'trening-zakończony.mp3';
          }

          units.splice(i+1, 0, { 
            exercise: { 
              name: name,
            },
            remarks: remarks,
            soundname: soundname,
          });
        }
      }

      units.unshift({ 
        exercise: { 
          name: 'Rozpoczynasz nowy blok' 
        },
        remarks: 'Zapoznaj się z rozpiską i przygotuj sprzęt', 
        soundname: 'rozpoczynasz-blok.mp3'
      });

      if (this.controllers.section == 0 && this.controllers.complex == 0) {
        units.unshift({
          exercise: {
            name: 'Witaj w cyfrowym asystencie treningu!',
          }, 
          remarks: 'Włącz lub wyłącz dźwięk ikoną głośnika', 
          soundname: 'witaj-w-asystencie.mp3'
        })
      }

      return units;
    },
  }
}
</script>

<style lang="scss" scoped>

  .workout-assistant {
    height: 100%;
    background-size: cover;
    background-position: center;
    position: relative;
  }

  .workout-assistant__bar {
    width: 100%;
    background: transparent;
    position: absolute;
    top: 0;
    left: 0;

    span {
      width: 20%;
      z-index: initial;
    }
    h3 {
      text-transform: capitalize;
      width: 60%;
    }
  }

  .workout-assistant__complex-tab {
    position: absolute; 
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: color(assistantblack);
    z-index: 1;
    overflow: scroll;

    &::-webkit-scrollbar {
      display: none;
    }

    div:nth-child(2) div {
      animation: fade-and-slide-down 0.7s;
    }
  }

  .workout-assistant__exercise {
    .left {
      flex-basis: 1;
      overflow: hidden;
    } 
    .right {
      flex-basis: 1;
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

  .workout-assistant__indicators-bar {
    height: 2px;
    flex: 1;
    margin-right: 1px;
    background: color(gray);
    position: relative;

    &:last-child {
      margin: 0;
    }
  }
</style>