<template>
  <div 
    class="workout-assistant column j-end main pt1 pb0" 
    :class="{ half: isScreenDivided }"
    :style="{ backgroundImage: image }"
    @click.self="nextUnit">
  <!-- STATUS BAR  -->
    <div class="workout-assistant__bar row j-between a-center main pb1 pt1">
      <span class="logo">Piti</span>
      <h3 class="m00 t-center" v-if="!isScreenDivided">{{ sections[controls.section].name | shortenSection }}</h3>
      <p class="m00 t-center" v-else>{{ workout.user.fullname | getName }}: {{ sections[controls.section].name | shortenSection }}</p>
      <span class="hamburger t-right">
        <i class="flaticon-cancel small" @click="$router.go(-1)"></i>
      </span>
    </div>
    <div>
  <!-- MODAL INFO  -->
      <transition name="slide-to-right">
        <p class="m00 t-small" v-show="showInfoModal">
          {{ infoModalMessage }}
        </p>
      </transition>
  <!-- STOPER -->
      <transition name="slide-to-right">
        <Stopwatch v-if="showStopwatch" />
      </transition>
  <!-- ROZPISKA AKTUALNEGO BLOKU -->
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
            v-for="(unit, index) in sections[controls.section].complexes[controls.complex].units" 
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
        <div>
          <MovingText :key="current.exercise.name">
            <h3 class="m00">{{ current.exercise.name }}</h3>
          </MovingText>
          <p class="t-small m00" v-if="current.remarks">{{ current.remarks }}</p>
          <p class="t-small m00" v-else>Wykonaj teraz</p>
          <p class="t-small m00" v-if="lastSet">ostatnia seria</p>
        </div>
        <Timer 
          :time="current.time"
          :mute="voiceAssistantSpeaking || voiceAssistantMode == 'off'"
          @countdown-over="nextUnit"
          :key="controls.unit"
          v-if="!current.sets && current.time || automaticModeOn && current.time && !current.reps" />
        <div class="row a-center j-end pl1" v-else>
          <p class="m00 fs-2" v-if="current.reps">{{ current.reps }}</p>
          <p class="m00 fs-2" v-if="current.reps && current.time"><span class="fs-15">x</span>{{ current.time }}<span class="fs-15">s</span></p>
          <p class="m00 fs-2" v-if="current.time && !current.reps">{{ current.time }}s</p>
          <p class="m00 t-right fs-2" v-if="current.distance">{{ current.distance }}<span class="fs-15">m</span></p>
        </div>
      </div>
      <div class="workout-assistant__indicators" >
        <p class="m00 t-small">
          {{ `Blok ${controls.complex + 1 }/${ sections[controls.section].complexes.length}` }}
        </p>
        <div class="row j-between">
          <span 
            class="workout-assistant__indicators-bar t-center"
            :class="{ 'b-white': index <= controls.unit }"
            v-for="(unit, index) in units" 
            :key="index" 
            @click="controls.unit = index"></span>
        </div>
      </div>
  <!-- PANEL STEROWANIA -->
      <div class="row j-between a-center pt1 pb1">
        <span>
          <i class="flaticon-sound small" :class="{ 'pulsing-element': controls.section == 0 && controls.complex == 0 && controls.unit == 0 }" @click="voiceAssistantMode = 'half-on'" v-if="voiceAssistantMode == 'on'"></i>
          <i class="flaticon-speaker small" :class="{ 'pulsing-element': controls.section == 0 && controls.complex == 0 && controls.unit == 0 }" @click="voiceAssistantMode = 'off'" v-else-if="voiceAssistantMode == 'half-on'"></i>
          <i class="flaticon-mute small" :class="{ 'pulsing-element': controls.section == 0 && controls.complex == 0 && controls.unit == 0 }" @click="voiceAssistantMode = 'on'" v-else></i>
        </span>
        <i class="flaticon-login small" :class="{ 't-green': automaticModeOn }" @click="toggleAutomaticMode"></i>
        <i class="flaticon-previous-track-button" @click="previousUnit"></i>
        <i class="flaticon-play-and-pause-button" @click="nextUnit"></i>
        <i class="flaticon-clock small" :class="{ 't-green': showStopwatch }" @click="showStopwatch = !showStopwatch"></i>
        <i class="flaticon-menu-1 small" :class="{ 'pulsing-element': current.exercise.name == 'Rozpoczynasz nowy blok' }" @click="showWholeComplex = true"></i>
      </div>
      <!-- <VoiceAssistant 
        :soundname="soundname" 
        :key="current.soundname"
        @playing="voiceAssistantSpeaking = true" 
        @ended="voiceAssistantSpeaking = false"
        v-if="voiceAssistantMode == 'on'" /> -->
    </div>
  </div>
</template>

<script>

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
  data() {
    return {
      audio: null,
      sections: this.workout.sections,
      controls: this.$store.state.main.workoutAssistantState[this.workout.id] ? { ...this.$store.state.main.workoutAssistantState[this.workout.id] } : {
        section: this.$route.query.section,
        complex: 0, 
        unit: 0,
      }, 
      showStopwatch: false,
      automaticModeOn: false,
      voiceAssistantMode: 'off',
      voiceAssistantSpeaking: false, 
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
          this.infoModalMessage = 'Asystent głosowy włączony';
          this.playAudio(this.soundname);
          break;
        case 'half-on':
          this.infoModalMessage = 'Asystent głosowy: tylko dź,3więki timera';
          this.audio.pause();
          break;
        case 'off':
          this.infoModalMessage = 'Asystent głosowy wyłączony'; 
      }
      this.infoModalTimeout = setTimeout(() => {
        this.showInfoModal = false;
      }, 2000);
    },
    currentUnit() {
      if (this.voiceAssistantMode == 'on') this.playAudio(this.soundname);
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
      this.controls.unit++;
      if (this.controls.unit > this.units.length - 1) {
        this.nextComplex();
      }
      this.$emit('set-current-state', { 
        unit: this.controls.unit, complex: this.controls.complex, section: this.controls.section 
      });
    },
    previousUnit() {
      this.controls.unit--;
      if (this.controls.unit < 0) {
        this.previousComplex();
      }
      this.$emit('set-current-state', { 
        unit: this.controls.unit, 
        complex: this.controls.complex, 
        section: this.controls.section 
      });
    },
    nextComplex() {
      this.controls.complex++;
      if (this.controls.complex > this.sections[this.controls.section].complexes.length - 1) {
        this.nextSection();
      } else {
        this.controls.unit = 0;
      }
    },
    previousComplex() {
      this.controls.complex--
      if (this.controls.complex < 0) {
        this.previousSection();
      } else {
        this.controls.unit = this.units.length - 1;
      }
    },
    nextSection() {
      this.controls.section++;
      if (this.controls.section > this.sections.length - 1) {
        this.controls.section = this.sections.length - 1;
        this.controls.complex = this.sections[this.controls.section].complexes.length - 1;
        this.controls.unit = this.units.length - 1;
      } else {
        this.controls.unit = 0;
        this.controls.complex = 0;
      }
    },
    previousSection() {
      this.controls.section--;
      if (this.controls.section < 0) {
        this.controls.complex = 0;
        this.controls.unit = 0;
        this.controls.section = 0;
      } else {
        this.controls.complex = this.sections[this.controls.section].complexes.length - 1;
        this.controls.unit = this.units.length - 1;
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
    },
    playAudio(audio) {
      if (!this.audio) this.audio = new Audio();
      this.audio.src = require(`@/assets/sounds/${audio}`);
      this.audio.play();
    },
  },
  computed: {
    currentUnit() {
      return this.controls.unit;
    },
    soundname() {
      if (this.current.soundname) {
        return this.current.soundname;
      } else if (!this.current.soundname && this.lastSet) {
        return 'ostatniaseria.mp3';
      } else {
        return 'dzialaj.mp3';
      }
    },
    image() {
      let image; 
      if (this.current.exercise.name == 'Odpocznij') {
        image = this.next.exercise.image ? this.next.exercise.image.url : 'https://media.giphy.com/media/fdlcvptCs4qsM/giphy.gif';
      } else if (this.current.exercise.name == 'Rozpoczynasz nowy blok' || this.current.exercise.name == 'Witaj w cyfrowym asystencie treningu!') {
        image = 'https://media.giphy.com/media/e2nYWcTk0s8TK/giphy.gif';
      } else if (this.current.exercise.name == 'Ukończyłeś blok' || this.current.exercise.name == 'Ukończyłeś sekcję' || this.current.exercise.name == 'Ukończyłeś trening') {
        image = 'https://media.giphy.com/media/fdlcvptCs4qsM/giphy.gif';
      } else {
        image = this.current.exercise.image ? this.current.exercise.image.url : 'https://media.giphy.com/media/e2nYWcTk0s8TK/giphy.gif';
      }

      if (!this.isScreenDivided) {
        return `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${image}')`;
      } else {
        return 'none';
      }
    },
    current() {
      return this.units[this.controls.unit];
    },
    lastSet() {
      const lastIndex = this.units.lastIndexOf(this.units[this.controls.unit]);
      if (lastIndex == this.controls.unit && this.units[this.controls.unit].exercise.name != 'Za chwilę:' && this.units[this.controls.unit].sets > 1) {
        return true;
      } else {
        return false;
      }
    },
    next() {
      let next = this.units[this.controls.unit + 1];
      
      if (this.controls.unit + 1 > this.units.length - 1) {
        next = { exercise: { name: 'Kolejny blok', images: [] } }
      }

      return next;
    },
    units() {
      let units = [];

      // Get array of arrays containing all sets of a given exercise
      // IE: 3x8 e1, 3x6 e2
      // => [[e1, e1, e1], [e2, e2, e2]]
      this.sections[this.controls.section].complexes[this.controls.complex].units.forEach((unit, unitindex) => {
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
            soundname: 'luz.mp3'
          });
        } else if (rest > 0 && i == units.length - 1) {
          let name, remarks, soundname; 

          if (this.controls.complex < this.sections[this.controls.section].complexes.length - 1) {
            name = 'Ukończyłeś blok';
            remarks = 'Odpocznij i przejdź do kolejnego';
            soundname = 'blok-zakonczony.mp3';
          } else if (this.controls.complex == this.sections[this.controls.section].complexes.length - 1 && this.controls.section < this.sections.length - 1) {
            name = 'Ukończyłeś sekcję';
            remarks = 'Odpocznij i przejdź do kolejnej';
            soundname = 'sekcja-zakończona.mp3';
          } else if (this.controls.complex == this.sections[this.controls.section].complexes.length - 1 && this.controls.section == this.sections.length - 1) {
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
        soundname: 'rozpoczynaszblok.mp3'
      });

      if (this.controls.section == 0 && this.controls.complex == 0) {
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
  },
}
</script>

<style lang="scss" scoped>

  .workout-assistant {
    height: 100%;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
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

  .workout-assistant__exercise div {
    &:first-child {
      flex-basis: 1;
      overflow: hidden;
    } 
    &:nth-child(2) {
      flex-basis: 1;
    }
  }

  .grow {
    flex-grow: 1;
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