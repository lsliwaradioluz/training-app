<template>
  <div 
    class="workout-assistant main column j-end pb0"
    :style="{ backgroundImage: image }"
    @click.self="nextUnit">
    <div>
  <!-- STOPER -->
      <transition name="slide-to-right">
        <Stopwatch v-if="showStopwatch" />
      </transition>
  <!-- ĆWICZENIE -->
      <div class="workout-assistant__exercise pt1 pb1 row a-start j-between">
        <div>
          <MovingText :key="current.exercise.name" v-if="showWorkoutAssistant">
            <h3 class="m00">{{ current.exercise.name }}</h3>
          </MovingText>
          <p class="fs-11 m00" v-if="current.remarks">{{ current.remarks }}</p>
          <p class="fs-11 m00" v-else>Wykonaj teraz</p>
          <p class="fs-11 m00" v-if="lastSet">ostatnia seria</p>
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
      <div class="workout-assistant__indicators" >
        <div class="row j-between" style="margin-bottom: 1px">
          <p class="m00 fs-11">
            {{ `${sections[controls.section].name} ${controls.complex + 1 }/${ sections[controls.section].complexes.length}` }}
          </p>
          <p class="m00 fs-11" v-if="isScreenDivided">{{ workout.user.fullname | getName }}</p>
        </div>
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
      <div class="workout-assistant__panel row j-between a-center" style="z-index: 300">
        <span>
          <i class="flaticon-sound" @click="voiceAssistantMode = 'half-on'" v-if="voiceAssistantMode == 'on'"></i>
          <i class="flaticon-speaker" @click="voiceAssistantMode = 'off'" v-else-if="voiceAssistantMode == 'half-on'"></i>
          <i class="flaticon-mute" @click="voiceAssistantMode = 'on'" v-else></i>
        </span>
        <i class="flaticon-login" :class="{ 't-headers': automaticModeOn }" @click="toggleAutomaticMode"></i>
        <i class="flaticon-previous-track-button" @click="previousUnit"></i>
        <i class="flaticon-play-and-pause-button" @click="nextUnit"></i>
        <i class="flaticon-counterclockwise" :class="{ 't-headers': showStopwatch }" @click="showStopwatch = !showStopwatch"></i>
        <i class="flaticon-cancel" @click="$store.commit('assistant/toggleWorkoutAssistant')"></i>
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
      showInfoModal: false,
      infoModalMessage: null,
      infoModalTimeout: null,
    }
  },
  watch: {
    voiceAssistantMode() {
      clearTimeout(this.infoModalTimeout);
      this.showInfoModal = true;
      switch (this.voiceAssistantMode) {
        case 'on':
          this.infoModalMessage = 'Asystent głosowy: włączony';
          this.playAudio(this.soundname);
          break;
        case 'half-on':
          this.infoModalMessage = 'Asystent głosowy: tylko dźwięki timera';
          if (this.voiceAssistantSpeaking) this.audio.pause();
          break;
        case 'off':
          this.infoModalMessage = 'Asystent głosowy: wyłączony'; 
          this.audio.pause();
      }
      this.infoModalTimeout = setTimeout(() => {
        this.showInfoModal = false;
      }, 2000);
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
      clearTimeout(this.infoModalTimeout);
      this.automaticModeOn = !this.automaticModeOn;
      this.showInfoModal = true;
      if (this.automaticModeOn) {
        this.infoModalMessage = 'Tryb automatyczny włączony';
      } else {
        this.infoModalMessage = 'Tryb automatyczny wyłączony';
      }
      this.infoModalTimeout = setTimeout(() => {
        this.showInfoModal = false;
      }, 2000);
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

      return `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${image}')`;
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
    height: 100vh;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
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

  .workout-assistant__indicators-bar {
    height: 2px;
    flex: 1;
    margin-right: 1px;
    background: gray;
    position: relative;

    &:last-child {
      margin: 0;
    }
  }

  .workout-assistant__panel {
    padding: 1rem 0;
    i {
      font-size: 16px;
    }
  }
</style>