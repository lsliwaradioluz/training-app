<template>
  <div class="workout-editor">
    <p class="mb0">Przygotuj rozpiskę w tempie błyskawicy, wykorzystując innowacyjny edytor treningów. Kopiuj gotowe elementy z poprzednich sesji lub twórz całkowicie nowe.</p>
  <!-- TERMIN  -->
    <h4 class="t-faded m00 pt1 pb05">Termin</h4>
    <div class="inputs">
      <CustomInput 
        class="mr05"
        placeholder="Data"
        v-model="selectedDate"
        type="date"
        :disabled="sticky"
        :show-status="false"
        show-label />
      <CustomInput 
        class="mr05"
        placeholder="Godzina"
        v-model="selectedTime"
        type="time"
        :disabled="sticky"
        :show-status="false" 
        show-label />
      <CustomCheckbox 
        label="Przyklejony"
        v-model="sticky" />
    </div>
  <!-- ROZPISKA  -->
    <div class="workout-editor__routine">
      <h4 class="row j-between a-center t-faded m00 pt1 pb05">
        <span>Rozpiska</span>
        <ContextMenu @toggled="showUnitButtons = $event">
          <template v-slot:trigger>
            <button class="flaticon-vertical-dots" type="button"></button>
          </template>
          <template v-slot:options>
            <button class="flaticon-left-arrow-1 fs-12 mr05" @click="createSection('before')">
              Dodaj sekcję przed
            </button>
            <button class="flaticon-right-arrow-1 fs-12 mr05" @click="createSection('after')">
              Dodaj sekcję za
            </button>
            <button class="flaticon-trash fs-12 mr05" @click="deleteSection">
              Usuń
            </button>
          </template>
        </ContextMenu>
      </h4>
      <div class="carousel-container b-secondary" v-if="sections.length > 0">
        <Carousel 
          :show-pagination="false" 
          :blocked="showButtonsPanel || currentComplex != null || showUnitButtons" 
          :start-from-page="currentSection" 
          :key="sections.length"
          @change-page="currentSection = $event">
          <div class="p11 column" v-for="(section, sectionindex) in sections" :key="sectionindex">
            <Routine class="pb2" :section="section" :current-complex="currentComplex">
              <template v-slot:section-buttons>
                <button class="flaticon-plus-1" type="button" @click="openUnitEditor()"></button>
              </template>
              <template v-slot:complex-buttons="{ complexindex }">
                <div>
                  <button class="flaticon-plus-1 fs-12" type="button" @click="currentComplex = complexindex" v-show="currentComplex != complexindex"></button>
                  <button class="flaticon-tick fs-12" type="button" @click="currentComplex = null" v-show="currentComplex == complexindex"></button>
                </div>
              </template>
              <template v-slot:unit-buttons="{ unit, unitindex, complex, complexindex }">
                <ContextMenu @toggled="showUnitButtons = $event">
                  <template v-slot:trigger>
                    <button class="flaticon-vertical-dots fs-12" type="button"></button>
                  </template>
                  <template v-slot:options>
                    <button class="flaticon-up fs-12 mr05" @click="moveUnit(currentSection, complexindex, unitindex, 'up')" v-show="unitindex != 0">
                      Przesuń w górę
                    </button>
                    <button class="flaticon-down-arrow-1 fs-12 mr05" @click="moveUnit(currentSection, complexindex, unitindex, 'down')" v-show="unitindex != complex.units.length - 1">
                      Przesuń w dół
                    </button>
                    <button class="flaticon-double-arrow-cross-of-shuffle fs-12 mr05" @click="currentComplex = complexindex" v-show="currentComplex == null && complex.units.length < 2">
                      Paruj
                    </button>
                    <button class="flaticon-writing fs-12 mr05" @click="openUnitEditor(unit, unitindex, complexindex)">
                      Edytuj
                    </button>
                    <button class="flaticon-trash fs-12 mr05" @click="deleteUnit(complexindex, unitindex)">
                      Usuń
                    </button>
                  </template>
                </ContextMenu>
              </template>
            </Routine>
          </div>
        </Carousel>
      </div>
      <p class="m00 tab" v-else>
        Na razie nie dodałeś żadnych sekcji.
      </p>
    <!-- POPRZEDNIE TRENINGI  -->
      <div v-if="user.workouts.length > 0">
        <div class="row j-between a-center pt1 pb05 t-faded">
          <h4 class="mb0 t-faded" v-if="!user.workouts[currentWorkout].user">
            {{ user.workouts[currentWorkout].scheduled | getDayName }}
            {{ user.workouts[currentWorkout].scheduled | getDayAndMonth }}
          </h4>
          <h4 class="mb0 t-faded" v-else>
            {{ user.workouts[currentWorkout].scheduled | getDayName }} 
            {{ user.workouts[currentWorkout].scheduled | getDayAndMonth }} 
            ({{ user.workouts[currentWorkout].user.username }})
          </h4>
          <div class="row">
            <button class="flaticon-left-arrow mr05" type="button" @click="showPreviousWorkout"></button>
            <button class="flaticon-right-arrow" type="button" @click="showNextWorkout"></button>
          </div>
        </div>
        <div class="carousel-container" v-if="sections.length > 0">
          <Carousel :show-pagination="false" :key="previousWorkoutSections.length">
            <div class="p11 column b-secondary" v-for="section in previousWorkoutSections" :key="section.id">
              <Routine
                :section="section" 
                @copy-unit="addUnit($event)"
                @copy-section="copySection($event)"
                @copy-complex="copyComplex($event)" 
                copy>
              </Routine>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
    <Modal :show="Boolean(editedUnit)" @close="closeUnitEditor">
      <UnitEditor 
        :exercises="exercises"
        :editedUnit="editedUnit" 
        @add-unit="addUnit($event)"
        @cancel="closeUnitEditor"/>
    </Modal>
  <!-- BUTTONY ZAPISZ ODRZUĆ -->
    <div class="workout-editor__buttons">
      <button class="button-primary" type="button" @click="uploadWorkout">Zapisz</button>
      <button class="button-primary" type="button" @click="$router.go(-1)">Wróć</button>
    </div>
  </div>
</template>

<script>
  import exercisesQuery from '~/apollo/queries/users/_id/exercises.gql';
  import getUserQuery from '~/apollo/queries/users/_id/main.gql';
  import getWorkoutsQuery from '~/apollo/queries/workouts/new/main.gql';
  import createWorkout from '~/apollo/mutations/createWorkout.gql';
  import updateWorkout from '~/apollo/mutations/updateWorkout.gql';
  
  export default {
    props: {
      specificData: {
        type: Object
      }, 
      edit: {
        type: Boolean
      }
    },
    data() {
      return {
        client: this.$apollo.getClient(),
        ...this.specificData,
        showButtonsPanel: false,
        showUnitButtons: null,
        currentWorkout: 0,
        currentSection: 0, 
        currentComplex: null,
        currentUnit: null,
        exercises: null,
        editedUnit: null, 
      }
    },
    computed: {
      filteredSections() {
        let sectionsClone = JSON.parse(JSON.stringify(this.sections));
        sectionsClone.forEach((section, sectionindex) => {
          sectionsClone[sectionindex] = _.omit(section, '__typename', 'id');
          section.complexes.forEach((complex, complexindex) => {
            sectionsClone[sectionindex].complexes[complexindex] = _.omit(complex, '__typename', 'id');
            complex.units.forEach((unit, unitindex) => {
              sectionsClone[sectionindex].complexes[complexindex].units[unitindex] = _.omit(unit, '__typename', 'id', 'max');
              sectionsClone[sectionindex].complexes[complexindex].units[unitindex].exercise = unit.exercise.id;
            });
          });
        });
        return sectionsClone;
      },
      dateAndTime() {
        return new Date(this.selectedDate + " " + this.selectedTime);
      },
      workoutReady() {
        const sectionsNotEmpty = this.sections.filter(section => {
          return section.complexes.length > 0;
        });
        return Boolean(sectionsNotEmpty.length);
      },
      previousWorkoutSections() {
        const previousWorkoutSections = this.user.workouts[this.currentWorkout].sections.filter(section => {
          return section.complexes.length > 0;
        });
        return previousWorkoutSections;
      }
    },
    methods: {
      createSection(index) {
        const newSection = {
          name: 'Nowa sekcja',
          complexes: [],
        };
        const newIndex = index == 'before' ? this.currentSection : this.currentSection + 1;
        this.sections.splice(newIndex, 0, newSection);
        this.currentSection = newIndex;
        this.showButtonsPanel = false;
        setTimeout(() => {
          let input = `input${newIndex}`;
          this.$refs[input][0].focus();
        }, 700);
      },
      deleteSection() {
        this.sections.splice(this.currentSection, 1);
        this.showButtonsPanel = false;
        this.currentSection = this.currentSection == 0 ? 0 : this.currentSection - 1;
      },
      populateUnitEditor(unit) {
        if (unit != undefined) {
          this.editedUnit = {
            exercise: unit.exercise,
            numbers: {
              sets: unit.sets || 0, 
              reps: unit.reps || 0, 
              time: unit.time || 0,
              distance: unit.distance || 0, 
              rest: unit.rest || 0
            },
            remarks: unit.remarks || ''
          }
        } else {
          let rest;
          if (this.currentComplex != null) {
            let units = this.sections[this.currentSection].complexes[this.currentComplex].units;
            rest = units[units.length - 1].rest;
          } else { 
            this.sections[this.currentSection].complexes.length > 0 ? 
              rest = this.sections[this.currentSection].complexes[0].units[0].rest
              : rest = 90;
          }
          this.editedUnit = {
            exercise: {
              name: '',
              id: '',
            }, 
            numbers: {
              sets: 0, 
              reps: 0, 
              time: 0,
              distance: 0,
              rest: rest,
            },
            remarks: ''
          }
        }
      },
      openUnitEditor(unit, unitindex, complexindex) {
        if (!this.exercises) {
          this.client.query({ query: exercisesQuery })
            .then(({ data }) => {
              this.exercises = data.exercises;
              this.populateUnitEditor(unit);
              // to trzeba skrócić 
              if (unit != undefined) {
                this.currentUnit = unitindex;
                this.currentComplex = complexindex;
              }
            });
        } else {
          this.populateUnitEditor(unit);
          // z tym
          if (unit != undefined) {
            this.currentUnit = unitindex;
            this.currentComplex = complexindex;
          }
        }
      },
      closeUnitEditor() {
        this.editedUnit = null;
        this.currentComplex = null;
        this.currentUnit = null;
      },
      addUnit(unit) {
        const unitClone = JSON.parse(JSON.stringify(unit));
        if (this.currentComplex == null && this.currentUnit == null) {
          const newComplex = {
            name: "Blok", 
            units: [
              unitClone
            ]
          }
          this.sections[this.currentSection].complexes.push(newComplex);
        } else if (this.currentComplex != null && this.currentUnit == null) {
          this.sections[this.currentSection].complexes[this.currentComplex].units.push(unitClone);
        } else {
          this.sections[this.currentSection].complexes[this.currentComplex].units[this.currentUnit] = unitClone;
          this.currentComplex = null;
          this.currentUnit = null;
        }
        this.editedUnit = null;
      },
      deleteUnit(complex, unit) {
        this.sections[this.currentSection].complexes[complex].units.splice(unit, 1);
        if (this.sections[this.currentSection].complexes[complex].units.length == 0) { 
          this.sections[this.currentSection].complexes.splice(complex, 1);
          this.currentComplex = null;
        }
      },
      moveUnit(sectionindex, complexindex, unitindex, direction) {
        let currentUnits = this.sections[sectionindex].complexes[complexindex].units;
        let unitToMove = currentUnits[unitindex];
        let newIndex = direction == 'up' ? unitindex - 1 : unitindex + 1;
        
        currentUnits.splice(unitindex, 1);
        currentUnits.splice(newIndex, 0, unitToMove);
      },
      copySection(section) {
        const sectionClone = JSON.parse(JSON.stringify(section));
        this.sections[this.currentSection].complexes.push(...sectionClone.complexes);
        this.sections[this.currentSection].name = sectionClone.name;
      },
      copyComplex(complex) {
        const complexClone = JSON.parse(JSON.stringify(complex));
        this.sections[this.currentSection].complexes.push(complexClone);
      },
      uploadWorkout() {
        let input;
        if (this.edit == true) {
          input = {
            where: {
              id: this.id,
            },
            data: {
              scheduled: this.dateAndTime,
              sticky: this.sticky,
              ready: this.workoutReady, 
              sections: this.filteredSections,
            }
          }
        } else {
          input = {
            data: {
              user: this.user.id,
              scheduled: this.dateAndTime,
              sticky: this.sticky,
              ready: this.workoutReady, 
              sections: this.filteredSections,
            }
          }
        }
        
        if (this.edit) {
          this.client.mutate({ mutation: updateWorkout, variables: { input: input }})
            .then(res => {
              this.$router.go(-1);
            });
        } else {
          this.client.mutate({ 
            mutation: createWorkout, 
            variables: { input: input },
            update: (cache, { data: { createWorkout } }) => {
              // read data from cache for this query
              const data_1 = cache.readQuery({ query: getUserQuery, variables: { id: this.user.id } });
              const data_2 = cache.readQuery({ query: getWorkoutsQuery, variables: { id: this.user.id } });
              // push new item to the data read from the cache 
              data_1.user.workouts.unshift(createWorkout.workout);
              data_2.user.workouts.unshift(createWorkout.workout);
              // write data back to cache 
              this.client.writeQuery({ query: getUserQuery, data: data_1 });
              if (this.workoutReady) {
                this.client.writeQuery({ query: getWorkoutsQuery, data: data_2 });
              }
            }
          }).then(res => {
            this.$router.go(-1);
          });
        }
      }, 
      showPreviousWorkout() {
        this.currentWorkout == 0 ? this.currentWorkout = 0 : this.currentWorkout--
      },
      showNextWorkout() {
        this.currentWorkout == this.user.workouts.length - 1 ? this.currentWorkout = this.user.workouts.length - 1 : this.currentWorkout++
      }, 
    }, 
  }
</script>

<style lang="scss" scoped>

  .inputs {
    display: flex;
    width: 100vw;
    margin-left: -1rem;
    padding: 1rem;
    padding-bottom: .5rem;
    background-color: color(secondary);
  }

  .workout-editor__buttons {
    display: flex;
    justify-content: space-between;
    margin-left: -1rem;
    margin-bottom: -3rem;
    padding: 1rem;
    padding-bottom: 3rem;
    width: 100vw;
    background-color: color(secondary);
    button {
      width: 49%;
    }
  }
</style>