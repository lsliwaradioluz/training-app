<template>
  <div class="workout-assistant column j-end">
    <div class="navigation">
      <button class="close-button flaticon-left-arrow-2" @click="$store.commit('assistant/toggleWorkoutAssistant')"></button>
    </div>
    <div class="images">
      <div v-for="(image, index) in images" :key="index" :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${image}')` }"></div>
    </div>
    <div class="controls row">
      <button @click="previousUnit"></button>
      <button @click="nextUnit"></button>
    </div>
    <div class="panel">
      <transition name="slide-to-right">
        <Stopwatch v-if="showStopwatch" />
      </transition>
      <div class="panel-exercise pt1 pb1 row a-start j-between">
        <div>
          <MovingText :key="current.exercise.name" v-if="showWorkoutAssistant">
            <h3 class="m00 t-white">{{ current.exercise.name }}</h3>
          </MovingText>
          <p class="fs-12 m00" v-if="current.remarks">{{ current.remarks }}</p>
          <p class="fs-12 m00" v-else>Wykonaj teraz</p>
          <p class="fs-12 m00" v-if="lastSet">ostatnia seria</p>
        </div>
        <Timer 
          :time="current.time"
          :mute="voiceAssistantSpeaking || voiceAssistantMode == 'off'"
          @countdown-over="nextUnit" 
          @beep="playAudio($event)"
          :key="controls.unit"
          v-if="!current.sets && current.time || automaticModeOn && current.time && !current.reps" />
        <div class="row a-center j-end pl1" v-else>
          <p class="m00 fs-32" v-if="current.reps">{{ current.reps }}</p>
          <p class="m00 fs-32" v-if="current.reps && current.time"><span class="fs-22">x</span>{{ current.time }}<span class="fs-22">s</span></p>
          <p class="m00 fs-32" v-if="current.time && !current.reps">{{ current.time }}s</p>
          <p class="m00 t-right fs-32" v-if="current.distance">{{ current.distance }}<span class="fs-22">m</span></p>
        </div>
      </div>
      <div class="panel-indicators" >
        <div class="row j-between" style="margin-bottom: 1px">
          <p class="m00 fs-12">
            {{ `${sections[controls.section].name} ${controls.complex + 1 }/${ sections[controls.section].complexes.length}` }}
          </p>
          <p class="m00 fs-12" v-if="isScreenDivided">{{ workout.user.fullname | getName }}</p>
        </div>
        <div class="row j-between">
          <span 
            class="indicators-bar t-center"
            :class="{ 'b-white': index <= controls.unit }"
            v-for="(unit, index) in units" 
            :key="index" 
            @click="controls.unit = index"></span>
        </div>
      </div>
  <!-- PANEL STEROWANIA -->
      <div class="panel-buttons row j-between a-center">
        <button class="flaticon-sound" @click="voiceAssistantMode = 'half-on'" v-if="voiceAssistantMode == 'on'"></button>
        <button class="flaticon-speaker" @click="voiceAssistantMode = 'off'" v-else-if="voiceAssistantMode == 'half-on'"></button>
        <button class="flaticon-mute" @click="voiceAssistantMode = 'on'" v-else></button>
        <button class="flaticon-login" :class="{ 't-headers': automaticModeOn }" @click="toggleAutomaticMode"></button>
        <button class="flaticon-previous-track-button" @click="previousUnit"></button>
        <button class="flaticon-play-and-pause-button" @click="nextUnit"></button>
        <button class="flaticon-counterclockwise" :class="{ 't-headers': showStopwatch }" @click="showStopwatch = !showStopwatch"></button>
        <button class="flaticon-menu" @click="$emit('edit-feedback')"></button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: {
    workout: {
      type: Object, 
    }, 
    workoutIndex: {
      type: Number, 
    },
    isScreenDivided: {
      type: Boolean, 
      default: () => true
    },
    sectionIndex: {
      type: Number, 
      default: () => 0
    }
  },
  data() {
    return {
      audio: null,
      sections: this.workout.sections,
      controls: {
        section: this.sectionIndex,
        complex: 0, 
        unit: 0,
      }, 
      showStopwatch: false,
      automaticModeOn: false,
      voiceAssistantMode: 'off',
      voiceAssistantSpeaking: false,
    }
  },
  watch: {
    voiceAssistantMode() {
      switch (this.voiceAssistantMode) {
        case 'on':
          this.playAudio(this.soundname);
          this.setNotification('Asystent głosowy włączony');
          break;
        case 'half-on':
          this.setNotification('Asystent głosowy: tylko dźwięki timera');
          if (this.voiceAssistantSpeaking) this.audio.pause();
          break;
        case 'off':
          this.setNotification('Asystent głosowy wyłączony');
          this.audio.pause();
      }
    },
    currentUnit() {
      this.$emit('set-current-section', this.controls.section);
      if (this.voiceAssistantMode == 'on') this.playAudio(this.soundname);
    },
    async showWorkoutAssistant(value) {
      if (!value) {
        if (this.voiceAssistantSpeaking) this.audio.pause();
      }

      if (value && this.controls.section != this.sectionIndex) {
        if (await this.$root.$confirm("Wznowić asystenta?")) {
          this.$emit('set-current-section', this.controls.section);
        } else {
          this.controls.section = this.sectionIndex;
          this.controls.complex = 0;
          this.controls.unit = 0;
        }
      }
    },
  },
  methods: {
    ...mapMutations({
      toggleBlockDescription: 'assistant/toggleBlockDescription',
      setNotification: 'main/setNotification',
    }),
    nextUnit() {
      this.controls.unit++;
      if (this.controls.unit > this.units.length - 1) {
        this.nextComplex();
      }
    },
    previousUnit() {
      this.controls.unit--;
      if (this.controls.unit < 0) {
        this.previousComplex();
      }
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
        this.setNotification('Tryb automatyczny włączony');
      } else {
        this.setNotification('Tryb automatyczny wyłączony');
      }
    },
    playAudio(audio) {
      if (!this.audio) this.audio = new Audio();
      if (audio == this.soundname) this.voiceAssistantSpeaking = true;
      this.audio.addEventListener('ended', () => {
        this.voiceAssistantSpeaking = false;
      });
      this.audio.src = require(`@/assets/sounds/${audio}`);
      this.audio.play();
    },
  },
  computed: {
    ...mapGetters({
      showWorkoutAssistant: 'assistant/showWorkoutAssistant',
      showBlockDescription: 'assistant/showBlockDescription',
    }),
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
      if (this.controls.unit + 1 > this.units.length - 1) next = { exercise: { name: 'Kolejny blok', images: [] } };
      return next;
    },
    blockDescription() {
      return this.units.filter(unit => {
        return unit.sets || unit.time;
      });
      return this.units;
    },
    images() {
      let images = [];

      if (this.current.exercise.name == 'Rozpoczynasz nowy blok') {
        this.units.forEach(unit => {
          if (unit.sets && unit.exercise.image && images.indexOf(unit.exercise.image.url) == -1) {
            images.push(unit.exercise.image.url);
          }
        });
      } else if (this.current.exercise.name == 'Witaj w cyfrowym asystencie treningu!') {
        const image = 'https://media.giphy.com/media/e2nYWcTk0s8TK/giphy.gif';
        images.push(image);
      } else if (this.current.exercise.name == 'Odpocznij') {
        const image = this.next.exercise.image ? this.next.exercise.image.url : 'https://media.giphy.com/media/fdlcvptCs4qsM/giphy.gif';
        images.push(image);
      } else {
        const image = this.current.exercise.image ? this.current.exercise.image.url : 'https://media.giphy.com/media/fdlcvptCs4qsM/giphy.gif';
        images.push(image);
      }

      return images;
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
        }
      }

      if (this.controls.complex == this.sections[this.controls.section].complexes.length - 1 && this.controls.section == this.sections.length - 1) {
        units.push({ 
          exercise: { 
            name: 'Ukończyłeś trening',
          },
          remarks: 'Daj znać trenerowi, jak poszło!',
          soundname: 'trening-zakończony.mp3',
        });
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
    height: 100vh;
    padding: 0 1rem;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
  }

  .navigation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    z-index: 2;
  }

  .images {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    div {
      min-height: 140px;
      flex-basis: 50%;
      flex-shrink: 0;
      background-size: cover;
      background-position: center;
    }
    div:first-child {
      flex-grow: 1;
    }
  }

  .controls {
    margin-left: -1rem;
    width: 100vw;
    height: 100%;
    button {
      width: 100%;
      &:active {
        // give some styles to a button once it's clicked, for example moving arrow like in youtube
      }
    }
  }

  .panel {
    z-index: 2;
  }

  .panel-exercise div {
    &:first-child {
      flex-basis: 1;
      overflow: hidden;
    } 
    &:nth-child(2) {
      flex-basis: 1;
    }
  }

  .indicators-bar {
    height: 2px;
    flex: 1;
    margin-right: 1px;
    background: gray;

    &:last-child {
      margin: 0;
    }
  }

  .panel-buttons {
    padding: 1rem 0;
    button {
      font-size: 16px;
    }
  }
</style>