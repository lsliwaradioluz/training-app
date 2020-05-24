<template>
  <article class="workout-assistant column j-end">
    <section class="images">
      <div
        v-for="(image, index) in images"
        class="image"
        :key="index"
        :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${image.url}')` }">
        <p v-if="lastSet" class="image__last-set">
          ostatnia seria!
        </p>
        <p class="m00">{{ image.reps }} {{ image.exercise }}</p>
        <p class="m00">{{ image.remarks }}</p>
      </div>
    </section>
    <section class="controls row">
      <button @click="previousUnit" />
      <button @click="nextUnit" />
    </section>
    <section class="panel">
      <transition name="slide-to-right">
        <Stopwatch v-if="stopwatchOn" />
      </transition>
      <div class="panel__exercise row a-end j-between">
        <div>
          <MovingText v-if="showWorkoutAssistant" :key="current.exercise.name">
            <h3 class="m00 t-white">
              {{ current.exercise.name }}
            </h3>
          </MovingText>
          <p v-if="current.remarks" class="fs-12 m00">
            {{ current.remarks }}
          </p>
          <p v-else class="fs-12 m00">
            Wykonaj teraz
          </p>
        </div>
        <Timer
          v-if="
            (!current.sets && current.time) ||
            (automaticModeOn && current.time && !current.reps)
          "
          :key="controls.unit"
          :time="current.time"
          @countdown-over="nextUnit"
          @beep="playAudio($event)"
        />
        <div v-else class="panel__exercise__repetitions row a-center j-end pl1">
          <p v-if="current.reps" class="m00 fs-32">
            {{ current.reps }}
          </p>
          <p v-if="current.reps && current.time" class="m00 fs-32">
            <span class="fs-22">x</span>{{ current.time
            }}<span class="fs-22">s</span>
          </p>
          <p v-if="current.time && !current.reps" class="m00 fs-32">
            {{ current.time }}s
          </p>
          <p v-if="current.distance" class="m00 t-right fs-32">
            {{ current.distance }}<span class="fs-22">m</span>
          </p>
        </div>
      </div>
    </section>
    <section class="progress">
      <div class="progress-data row j-between">
        <p class="m00 fs-12">
          {{
            `${sections[controls.section].name} ${controls.complex + 1}/${
              sections[controls.section].complexes.length
            }`
          }}
        </p>
        <p v-if="isScreenDivided" class="m00 fs-12">
          {{ workout.user.fullname | getName }}
        </p>
      </div>
      <div class="progress-bars row j-between">
        <span
          v-for="(unit, index) in units"
          :key="index"
          :class="{ 'b-white': index <= controls.unit }"
          @click="controls.unit = index"
        />
      </div>
    </section>
    <section class="buttons">
      <button
        class="flaticon-cancel"
        @click="$store.commit('assistant/toggleWorkoutAssistant')"
      />
      <button
        v-if="soundEnabled"
        class="flaticon-sound"
        @click="soundEnabled = false"
      />
      <button v-else class="flaticon-mute" @click="soundEnabled = true" />
      <button
        class="flaticon-login"
        :class="{ 't-headers': automaticModeOn }"
        @click="toggleAutomaticMode"
      />
      <button
        class="flaticon-counterclockwise"
        :class="{ 't-headers': stopwatchOn }"
        @click="stopwatchOn = !stopwatchOn"
      />
      <button class="flaticon-menu" @click="$emit('edit-feedback')" />
      <button class="flaticon-previous-track-button" @click="previousUnit" />
      <button class="flaticon-play-and-pause-button" @click="nextUnit" />
    </section>
  </article>
</template>

<script>
import { mapGetters, mapMutations } from "vuex"

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
      default: () => true,
    },
    sectionIndex: {
      type: Number,
      default: () => 0,
    },
  },
  data() {
    return {
      audio: new Audio(),
      sections: this.workout.sections,
      controls: {
        section: this.sectionIndex,
        complex: 0,
        unit: 0,
      },
      stopwatchOn: false,
      automaticModeOn: false,
      soundEnabled: true,
    }
  },
  watch: {
    currentUnit() {
      this.$emit("set-current-section", this.controls.section)
      if (this.current.exercise.name == "Odpocznij") {
        this.playAudio("luz.mp3")
      } else if (
        this.current.reps ||
        this.current.time ||
        this.current.distance
      ) {
        this.playAudio(this.lastSet ? "ostatniaseria.mp3" : "dzialaj.mp3")
      }
    },
    soundEnabled(value) {
      if (value) {
        this.audio.volume = 1
      } else {
        this.audio.volume = 0
      }
    },
    async showWorkoutAssistant(value) {
      if (value && this.controls.section != this.sectionIndex) {
        if (await this.$root.$confirm("Wznowić asystenta?")) {
          this.$emit("set-current-section", this.controls.section)
        } else {
          this.controls.section = this.sectionIndex
          this.controls.complex = 0
          this.controls.unit = 0
        }
      }
    },
  },
  methods: {
    ...mapMutations({
      setNotification: "main/setNotification",
    }),
    nextUnit() {
      this.controls.unit++
      if (this.controls.unit > this.units.length - 1) {
        this.nextComplex()
      }
    },
    previousUnit() {
      this.controls.unit--
      if (this.controls.unit < 0) {
        this.previousComplex()
      }
    },
    nextComplex() {
      this.controls.complex++
      if (
        this.controls.complex >
        this.sections[this.controls.section].complexes.length - 1
      ) {
        this.nextSection()
      } else {
        this.controls.unit = 0
      }
    },
    previousComplex() {
      this.controls.complex--
      if (this.controls.complex < 0) {
        this.previousSection()
      } else {
        this.controls.unit = this.units.length - 1
      }
    },
    nextSection() {
      this.controls.section++
      if (this.controls.section > this.sections.length - 1) {
        this.controls.section = this.sections.length - 1
        this.controls.complex =
          this.sections[this.controls.section].complexes.length - 1
        this.controls.unit = this.units.length - 1
      } else {
        this.controls.unit = 0
        this.controls.complex = 0
      }
    },
    previousSection() {
      this.controls.section--
      if (this.controls.section < 0) {
        this.controls.complex = 0
        this.controls.unit = 0
        this.controls.section = 0
      } else {
        this.controls.complex =
          this.sections[this.controls.section].complexes.length - 1
        this.controls.unit = this.units.length - 1
      }
    },
    toggleAutomaticMode() {
      this.automaticModeOn = !this.automaticModeOn
      if (this.automaticModeOn) {
        this.setNotification("Tryb automatyczny włączony")
      } else {
        this.setNotification("Tryb automatyczny wyłączony")
      }
    },
    playAudio(audio) {
      this.audio.src = require(`@/assets/sounds/${audio}`)
      this.audio.play()
    },
  },
  computed: {
    ...mapGetters({
      showWorkoutAssistant: "assistant/showWorkoutAssistant",
    }),
    currentUnit() {
      return this.controls.unit
    },
    current() {
      return this.units[this.controls.unit]
    },
    lastSet() {
      const lastIndex = this.units.lastIndexOf(this.units[this.controls.unit])
      return lastIndex == this.controls.unit &&
        this.units[this.controls.unit].sets > 1
        ? true
        : false
    },
    next() {
      return this.units[this.controls.unit + 1]
    },
    images() {
      let images = []

      if (this.current.exercise.name == "Rozpoczynasz nowy blok") {
        this.units.forEach((unit) => {
          if (
            unit.sets &&
            unit.exercise.image &&
            !images.find(image => image.url == unit.exercise.image.url )
          ) {
            let exercise = unit.exercise.name;
            let url = unit.exercise.image.url; 
            let reps = unit.sets;
            let remarks = unit.remarks;
            if (unit.reps) reps += `x${unit.reps}`
            if (unit.time) reps += `x${unit.time}s`
            if (unit.distance) reps += `x${unit.distance}m`
            images.push({ exercise, url, reps, remarks })
          }
        })
      } else if (this.current.exercise.name == "Odpocznij") {
        let url = this.next.exercise.image
          ? this.next.exercise.image.url
          : "https://media.giphy.com/media/fdlcvptCs4qsM/giphy.gif"
        images.push({ url })
      } else {
        let url = this.current.exercise.image
          ? this.current.exercise.image.url
          : "https://media.giphy.com/media/fdlcvptCs4qsM/giphy.gif"
        images.push({ url })
      }

      return images
    },
    units() {
      let units = []

      // Get array of arrays containing all sets of a given exercise
      // IE: 3x8 e1, 3x6 e2
      // => [[e1, e1, e1], [e2, e2, e2]]
      this.sections[this.controls.section].complexes[
        this.controls.complex
      ].units.forEach((unit) => {
        const groupedUnits = []
        for (let x = 0; x < unit.sets; x++) {
          groupedUnits.push(unit)
        }
        units.push(groupedUnits)
      })

      // Sort arrays pushing the longest to the front
      // [[e1, e1, e1], [e2, e2, e2, e2]]
      // => [[e2, e2, e2, e2], [e1, e1, e1]]
      units = units.sort((a, b) => {
        return b.length - a.length
      })

      // Zip the exercises creating two arrays
      // [[e2, e2, e2, e2], [e1, e1, e1]]
      // => [[e2, e1], [e2, e1], [e2, e1], [e2, undefined]]
      units = _.zip(...units)

      // Flatten the main array, removing nested arrays
      // [[e2, e1], [e2, e1], [e2, e1], [e2, undefined]]
      // => [e2, e1, e2, e1, e2, e1, e2, undefined]
      units = _.flattenDeep(units)

      // Filter the array to remove undefined if exists
      units = units.filter((unit) => {
        return unit != undefined
      })

      // Add the rest intervals if there should be any
      for (let i = 0; i <= units.length - 1; i++) {
        let rest = units[i].rest
        if (rest > 0 && i < units.length - 1) {
          let remarks
          if (units[i + 1].reps) {
            remarks = `Następnie: ${units[i + 1].reps} ${
              units[i + 1].exercise.name
            }`
          } else if (units[i + 1].time) {
            remarks = `Następnie: ${units[i + 1].time}s ${
              units[i + 1].exercise.name
            }`
          } else if (units[i + 1].distance) {
            remarks = `Następnie: ${units[i + 1].distance}m ${
              units[i + 1].exercise.name
            }`
          }

          units.splice(i + 1, 0, {
            exercise: { name: "Odpocznij" },
            time: rest,
            remarks: remarks,
          })
        }
      }

      units.unshift({
        exercise: { name: "Rozpoczynasz nowy blok" },
        remarks: "Kolejne ćwiczenia widoczne są na ekranie",
      })

      if (
        this.controls.complex ==
          this.sections[this.controls.section].complexes.length - 1 &&
        this.controls.section == this.sections.length - 1
      ) {
        units.push({
          exercise: { name: "Ukończyłeś trening" },
          remarks: "Daj znać trenerowi, jak poszło!",
        })
      }

      return units
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

.image__last-set {
  margin: 0;
  font-size: 13px;
  color: color(headers);
}

.images {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.image {
  min-height: 140px;
  flex-basis: 50%;
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
  padding: .5rem;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
  p {
    font-size: 12px;
  }
  &:first-child {
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

.panel__exercise {
  padding: 1rem 0;
  div:first-child {
    overflow: hidden;
  }
}

.panel__exercise__repetitions p {
  line-height: 1;
}

.progress {
  z-index: 2;
}

.progress-data {
  margin-bottom: 1px;
}

.progress-bars {
  span {
    height: 2px;
    flex: 1;
    margin-right: 1px;
    background: gray;
    &:last-child {
      margin: 0;
    }
  }
}

.buttons {
  padding: 1rem 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  button {
    font-size: 16px;
  }
}
</style>
