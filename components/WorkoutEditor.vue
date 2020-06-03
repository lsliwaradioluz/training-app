<template>
  <article class="workout-editor">
    <p class="mb0">
      Przygotuj rozpiskę w tempie błyskawicy, wykorzystując innowacyjny edytor
      treningów. Kopiuj gotowe elementy z poprzednich sesji lub twórz całkowicie
      nowe. {{ workoutReady }}
    </p>
    <section>
      <header>
        <h4 class="t-faded m00 pt1 pb05">
          Termin
        </h4>
      </header>
      <div class="inputs">
        <div class="row">
          <BaseInput
            v-model="selectedDate"
            class="mr05"
            placeholder="Data"
            type="date"
            :disabled="sticky"
            :show-status="false"
            show-label
          />
          <BaseInput
            v-model="selectedTime"
            class="mr05"
            placeholder="Godzina"
            type="time"
            :disabled="sticky"
            :show-status="false"
            show-label
          />
          <BaseCheckbox v-model="sticky" label="Przyklejony" />
        </div>
        <BaseInput
          v-show="sticky"
          v-model="name"
          placeholder="Nazwa treningu"
          type="text"
          :show-status="false"
        />
      </div>
    </section>
    <section>
      <header class="row j-between a-center t-faded pt1 pb05">
        <h4 class="m00 t-faded">
          Sekcje
        </h4>
        <button class="flaticon-plus" type="button" @click="createSection" />
      </header>
      <div class="carousel-container b-secondary">
        <Carousel
          v-if="sections.length > 0"
          :navigation-config="carouselNavConfig"
          :blocked="currentComplex != null"
          :start-from-page="currentSection"
          @change-page="currentSection = $event"
        >
          <div
            v-for="(section, sectionindex) in sections"
            :key="sectionindex"
            class="p11 column"
          >
            <Routine :section="section" :current-complex="currentComplex">
              <template v-slot:section-buttons>
                <ContextMenu>
                  <template v-slot:trigger>
                    <span class="flaticon-vertical-dots" />
                  </template>
                  <template v-slot:options>
                    <button
                      class="flaticon-add-button"
                      @click="openUnitEditor()"
                    >
                      Dodaj ćwiczenie
                    </button>
                    <button
                      v-show="currentSection > 0"
                      class="flaticon-left-arrow-1"
                      @click="moveSection('left')"
                    >
                      Przesuń w lewo
                    </button>
                    <button
                      v-show="currentSection < sections.length - 1"
                      class="flaticon-right-arrow-1"
                      @click="moveSection('right')"
                    >
                      Przesuń w prawo
                    </button>
                    <button class="flaticon-pencil" @click="openNameEditor()">
                      Zmień nazwę
                    </button>
                    <button class="flaticon-trash" @click="deleteSection">
                      Usuń
                    </button>
                  </template>
                </ContextMenu>
              </template>
              <template v-slot:complex-buttons="{ complexindex }">
                <ContextMenu v-show="currentComplex != complexindex">
                  <template v-slot:trigger>
                    <span class="flaticon-vertical-dots fs-12" />
                  </template>
                  <template v-slot:options>
                    <button
                      v-if="previousWorkouts.length > 0"
                      class="flaticon-double-arrow-cross-of-shuffle"
                      @click="currentComplex = complexindex"
                    >
                      Kopiuj ćwiczenie
                    </button>
                    <button
                      class="flaticon-add-button"
                      @click="addExerciseToComplex(complexindex)"
                    >
                      Dodaj ćwiczenie
                    </button>
                    <button
                      v-show="complexindex != 0"
                      class="flaticon-up"
                      @click="moveComplex(currentSection, complexindex, 'up')"
                    >
                      Przesuń w górę
                    </button>
                    <button
                      v-show="complexindex != section.complexes.length - 1"
                      class="flaticon-down-arrow-1"
                      @click="moveComplex(currentSection, complexindex, 'down')"
                    >
                      Przesuń w dół
                    </button>
                    <button
                      class="flaticon-pencil"
                      @click="openNameEditor(complexindex)"
                    >
                      Zmień nazwę
                    </button>
                    <button
                      class="flaticon-trash"
                      @click="deleteComplex(complexindex)"
                    >
                      Usuń
                    </button>
                  </template>
                </ContextMenu>
                <button
                  v-show="currentComplex == complexindex"
                  class="flaticon-tick fs-12"
                  type="button"
                  @click="currentComplex = null"
                />
              </template>
              <template
                v-slot:unit-buttons="{ unit, unitindex, complex, complexindex }"
              >
                <ContextMenu
                  :bottom="
                    unitindex == complex.units.length - 1 &&
                    complexindex == section.complexes.length - 1 &&
                    unitindex + complexindex > 0
                  "
                >
                  <template v-slot:trigger>
                    <span class="flaticon-vertical-dots fs-12" />
                  </template>
                  <template v-slot:options>
                    <button
                      v-show="unitindex != 0"
                      class="flaticon-up"
                      @click="
                        moveUnit(currentSection, complexindex, unitindex, 'up')
                      "
                    >
                      Przesuń w górę
                    </button>
                    <button
                      v-show="unitindex != complex.units.length - 1"
                      class="flaticon-down-arrow-1"
                      @click="
                        moveUnit(
                          currentSection,
                          complexindex,
                          unitindex,
                          'down'
                        )
                      "
                    >
                      Przesuń w dół
                    </button>
                    <template v-show="complex.units.length == 1">
                      <button
                        v-show="complexindex != 0"
                        class="flaticon-up"
                        @click="moveComplex(currentSection, complexindex, 'up')"
                      >
                        Przesuń w górę
                      </button>
                      <button
                        v-show="complexindex != section.complexes.length - 1"
                        class="flaticon-down-arrow-1"
                        @click="
                          moveComplex(currentSection, complexindex, 'down')
                        "
                      >
                        Przesuń w dół
                      </button>
                    </template>
                    <template
                      v-if="currentComplex == null && complex.units.length < 2"
                    >
                      <button
                        class="flaticon-add-button"
                        @click="addExerciseToComplex(complexindex)"
                      >
                        Dodaj ćwiczenie
                      </button>
                      <button
                        v-if="previousWorkouts.length > 0"
                        class="flaticon-double-arrow-cross-of-shuffle"
                        @click="currentComplex = complexindex"
                      >
                        Paruj
                      </button>
                    </template>
                    <button
                      class="flaticon-pencil"
                      @click="openUnitEditor(unit, unitindex, complexindex)"
                    >
                      Edytuj
                    </button>
                    <button
                      class="flaticon-trash"
                      @click="deleteUnit(complexindex, unitindex)"
                    >
                      Usuń
                    </button>
                  </template>
                </ContextMenu>
              </template>
            </Routine>
          </div>
        </Carousel>
        <p v-else class="m00 p11">
          Na razie nie dodałeś żadnych sekcji.
        </p>
      </div>
    </section>
    <!-- POPRZEDNIE TRENINGI  -->
    <section v-if="previousWorkouts.length > 0">
      <header
        class="row j-between a-start pt1 t-faded"
        :class="{ pb05: !previousWorkouts[currentWorkout].feedback }"
      >
        <div class="column">
          <h4 v-if="!previousWorkouts[currentWorkout].user" class="mb0 t-faded">
            {{ previousWorkouts[currentWorkout].scheduled | getDayName }}
            {{ previousWorkouts[currentWorkout].scheduled | getDayAndMonth }}
          </h4>
          <h4 v-else class="mb0 t-faded">
            {{ previousWorkouts[currentWorkout].scheduled | getDayName }}
            {{ previousWorkouts[currentWorkout].scheduled | getDayAndMonth }}
            ({{ previousWorkouts[currentWorkout].user.username }})
          </h4>
          <p
            v-show="previousWorkouts[currentWorkout].feedback"
            class="t-faded fs-13 mb05"
          >
            {{ previousWorkouts[currentWorkout].feedback }}
          </p>
        </div>
        <div class="row ml05">
          <button
            class="flaticon-left-arrow"
            type="button"
            @click="showPreviousWorkout"
          />
          <button
            class="flaticon-right-arrow"
            type="button"
            @click="showNextWorkout"
          />
        </div>
      </header>
      <div
        v-if="previousWorkoutSections.length > 0"
        class="carousel-container b-secondary"
      >
        <Carousel
          :key="previousWorkoutSections.length"
          :navigation-config="carouselNavConfig"
        >
          <div
            v-for="section in previousWorkoutSections"
            :key="section.id"
            class="p11 column"
          >
            <Routine :section="section">
              <template v-slot:section-buttons>
                <button
                  class="flaticon-plus"
                  type="button"
                  @click="copySection(section)"
                />
              </template>
              <template v-slot:complex-buttons="{ complex }">
                <button
                  class="flaticon-plus"
                  type="button"
                  @click="copyComplex(complex)"
                />
              </template>
              <template v-slot:unit-buttons="{ unit }">
                <button
                  class="flaticon-plus"
                  type="button"
                  @click="addUnit(unit)"
                />
              </template>
            </Routine>
          </div>
        </Carousel>
      </div>
    </section>
    <Modal :show="Boolean(editedUnit)">
      <UnitEditor
        :exercises="exercises"
        :edited-unit="editedUnit"
        @add-unit="addUnit($event)"
        @cancel="closeUnitEditor"
      />
    </Modal>
    <Modal :show="nameEditorVisible" @close="nameEditorVisible = false">
      <NameEditor
        :name="
          currentComplex == null
            ? sections[currentSection].name
            : sections[currentSection].complexes[currentComplex].name
        "
        @name-edited="closeNameEditor($event)"
        @close="closeNameEditor"
      />
    </Modal>
    <!-- BUTTONY ZAPISZ ODRZUĆ -->
    <section class="buttons">
      <button class="button-primary" type="button" @click="uploadWorkout">
        Zapisz
      </button>
      <button class="button-primary" type="button" @click="leaveAssistant">
        Anuluj
      </button>
    </section>
  </article>
</template>

<script>
import NameEditor from "~/components/NameEditor.vue"
import getSingleUser from "~/apollo/queries/getSingleUser.gql"
import createWorkout from "~/apollo/mutations/createWorkout.gql"
import updateWorkout from "~/apollo/mutations/updateWorkout.gql"

export default {
  components: { NameEditor },
  props: {
    template: {
      type: Object,
    },
    edit: {
      type: Boolean,
    },
  },
  data() {
    return {
      ...this.template,
      client: this.$apollo.getClient(),
      currentSection: 0,
      currentComplex: null,
      currentUnit: null,
      currentWorkout: 0,
      editedUnit: null,
      nameEditorVisible: false,
    }
  },
  computed: {
    filteredSections() {
      const sectionsClone = JSON.parse(JSON.stringify(this.sections))
      let filteredSections = sectionsClone.filter(section => {
        return section.complexes.length > 0 
      })
      //level one
      filteredSections.forEach((section, sectionindex) => {
        filteredSections[sectionindex] = _.omit(section, "__typename", "id")
        // level two
        section.complexes.forEach((complex, complexindex) => {
          filteredSections[sectionindex].complexes[complexindex] = _.omit(
            complex,
            "__typename",
            "id"
          )
          complex.units.forEach((unit, unitindex) => {
            filteredSections[sectionindex].complexes[complexindex].units[
              unitindex
            ] = _.omit(unit, "__typename", "id")
            filteredSections[sectionindex].complexes[complexindex].units[
              unitindex
            ].exercise = unit.exercise.id
          })
        })
      })

      return filteredSections
    },
    dateAndTime() {
      return new Date(this.selectedDate + " " + this.selectedTime)
    },
    workoutReady() {
      return this.filteredSections.length > 0
    },
    previousWorkouts() {
      let previousWorkouts
      if (this.edit) {
        previousWorkouts = this.user.workouts.filter(workout => {
          return workout.id != this.id && !workout.sticky && workout.ready
        })
      } else {
        previousWorkouts = this.user.workouts.filter(workout => {
          return !workout.sticky && workout.ready
        })
      }
      const workoutToCopy = this.$store.state.main.workoutToCopy
      if (workoutToCopy) {
        previousWorkouts.unshift(workoutToCopy)
      }
      return previousWorkouts
    },
    previousWorkoutSections() {
      const previousWorkoutSections = this.previousWorkouts[this.currentWorkout].sections.filter((section) => {
        return section.complexes.length > 0
      })
      return previousWorkoutSections
    },
    carouselNavConfig() {
      return {
        height: "2px",
        margin: "0",
        borderRadius: "0",
        activeColor: "#FDDCBD",
        fullWidth: true,
      }
    },
  },
  methods: {
    createSection() {
      const newSection = {
        name: "Nowa sekcja",
        complexes: [],
      }
      this.sections.push(newSection)
      this.currentSection = this.sections.length - 1
    },
    moveSection(direction) {
      let sectionToMove = this.sections[this.currentSection]
      let newIndex =
        direction == "left" ? this.currentSection - 1 : this.currentSection + 1
      this.sections.splice(this.currentSection, 1)
      this.sections.splice(newIndex, 0, sectionToMove)
      this.currentSection = newIndex
    },
    deleteSection() {
      this.sections.splice(this.currentSection, 1)
      this.currentSection =
        this.currentSection == 0 ? 0 : this.currentSection - 1
    },
    copySection(section) {
      const sectionClone = JSON.parse(JSON.stringify(section))
      this.sections[this.currentSection].complexes.push(
        ...sectionClone.complexes
      )
      this.sections[this.currentSection].name = sectionClone.name
    },
    moveComplex(sectionindex, complexindex, direction) {
      let currentComplexes = this.sections[sectionindex].complexes
      let complexToMove = currentComplexes[complexindex]
      let newIndex = direction == "up" ? complexindex - 1 : complexindex + 1

      currentComplexes.splice(complexindex, 1)
      currentComplexes.splice(newIndex, 0, complexToMove)
    },
    deleteComplex(complexindex) {
      this.sections[this.currentSection].complexes.splice(complexindex, 1)
      this.currentComplex = null
    },
    copyComplex(complex) {
      const complexClone = JSON.parse(JSON.stringify(complex))
      this.sections[this.currentSection].complexes.push(complexClone)
    },
    addExerciseToComplex(complexindex) {
      this.currentComplex = complexindex
      this.openUnitEditor()
    },
    addUnit(unit) {
      const unitClone = JSON.parse(JSON.stringify(unit))
      if (this.currentComplex == null && this.currentUnit == null) {
        const newComplex = {
          name: "Blok",
          units: [unitClone],
        }
        this.sections[this.currentSection].complexes.push(newComplex)
      } else if (this.currentComplex != null && this.currentUnit == null) {
        this.sections[this.currentSection].complexes[
          this.currentComplex
        ].units.push(unitClone)
      } else {
        this.sections[this.currentSection].complexes[this.currentComplex].units[
          this.currentUnit
        ] = unitClone
        this.currentComplex = null
        this.currentUnit = null
      }
      this.editedUnit = null
    },
    deleteUnit(complex, unit) {
      this.sections[this.currentSection].complexes[complex].units.splice(
        unit,
        1
      )
      if (
        this.sections[this.currentSection].complexes[complex].units.length == 0
      ) {
        this.sections[this.currentSection].complexes.splice(complex, 1)
        this.currentComplex = null
      }
    },
    moveUnit(sectionindex, complexindex, unitindex, direction) {
      let complexContainingUnit = this.sections[sectionindex].complexes[complexindex].units
      let unitToMove = complexContainingUnit[unitindex]
      let newIndex = direction == "up" ? unitindex - 1 : unitindex + 1

      complexContainingUnit.splice(unitindex, 1)
      complexContainingUnit.splice(newIndex, 0, unitToMove)
    },
    openUnitEditor(unit, unitindex, complexindex) {
      let rest
      let exercise = {
        name: "",
        id: "",
      }

      if (this.currentComplex != null) {
        let units = this.sections[this.currentSection].complexes[this.currentComplex].units
        rest = units[units.length - 1].rest
      } else {
        this.sections[this.currentSection].complexes.length > 0
          ? (rest = this.sections[this.currentSection].complexes[0].units[0].rest)
          : (rest = 90)
      }

      this.editedUnit = {
        exercise: unit && unit.exercise || exercise,
        numbers: {
          sets: unit && unit.sets || 0,
          reps: unit && unit.reps || 0,
          time: unit && unit.time || 0,
          distance: unit && unit.distance || 0,
          rest: unit && unit.rest || rest,
        },
        remarks: unit && unit.remarks || "",
      }

      if (unit != undefined) {
        this.currentUnit = unitindex
        this.currentComplex = complexindex
      }
    },
    closeUnitEditor() {
      this.editedUnit = null
      this.currentComplex = null
      this.currentUnit = null
    },
    openNameEditor(complex) {
      if (complex != undefined) {
        this.currentComplex = complex
      }
      this.nameEditorVisible = true
    },
    closeNameEditor(name) {
      if (this.currentComplex != null && name) {
        this.sections[this.currentSection].complexes[
          this.currentComplex
        ].name = name
        this.currentComplex = null
      } else if (!this.currentComplex && name) {
        this.sections[this.currentSection].name = name
      }
      this.nameEditorVisible = false
    },
    showPreviousWorkout() {
      this.currentWorkout == 0
        ? (this.currentWorkout = 0)
        : this.currentWorkout--
    },
    showNextWorkout() {
      this.currentWorkout == this.previousWorkouts.length - 1
        ? (this.currentWorkout = this.previousWorkouts.length - 1)
        : this.currentWorkout++
    },
    async uploadWorkout() {
      let configObj
      const input = {
        data: {
          scheduled: this.dateAndTime,
          sticky: this.sticky,
          name: this.name,
          ready: this.workoutReady,
          sections: this.filteredSections,
        },
      }
      if (this.edit) {
        input.where = { 
          id: this.id 
        }
        configObj = {
          mutation: updateWorkout, 
          variables: { input }
        }
      } else {
        input.data.user = this.user.id;
        configObj = {
          mutation: createWorkout,
          variables: { input },
          update: (cache, { data: { createWorkout } }) => {
            const data = cache.readQuery({
              query: getSingleUser,
              variables: { id: this.user.id },
            })
            data.user.workouts.unshift(createWorkout.workout)
            this.client.writeQuery({ query: getSingleUser, data })
          },
        }
      }

      try {
        await this.client.mutate(configObj)
      } catch {
        this.$store.commit('main/setNotification', 'Coś poszło nie tak. Spróbuj jeszcze raz')
        return
      }
      this.leaveAssistant();
    },
    leaveAssistant() {
      this.$store.commit('main/setIsEditing', false)
      this.$router.go(-1);
    }, 
    createBackup() {
      if (this.$store.state.main.workoutEditor.isEditing && this.workoutReady && !this.edit) {
        const workoutEditorBackup = {
          type: 'workoutEditorBackup', 
          sections: this.sections
        }
        this.$store.dispatch('main/addEntryToDb', workoutEditorBackup);
      }
    }, 
    async loadBackup() {
      const backup = this.$store.state.main.workoutEditor.backup;
      if (backup && !this.edit) {
        if (await this.$root.$confirm("W pamięci znajduje się niezapisany trening. Chcesz go dokończyć?")) {
          this.sections = backup.sections;
        }
        this.$store.dispatch('main/removeEntryFromDb', "workoutEditorBackup");
      }
      this.$store.commit('main/setIsEditing', true)
    }
  },
  mounted() {
    this.loadBackup();
  },
  beforeDestroy() {
    this.createBackup()
  }
}
</script>

<style lang="scss" scoped>
.inputs {
  width: 100vw;
  margin-left: -1rem;
  padding: 1rem;
  padding-bottom: 0.5rem;
  background-color: color(secondary);
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-left: -1rem;
  margin-bottom: -3rem;
  padding: 1rem;
  padding-bottom: 3rem;
  width: 100vw;
  background-color: color(secondary);
  .button-primary {
    width: 49%;
  }
}
</style>
