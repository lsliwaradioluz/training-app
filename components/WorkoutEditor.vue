<template>
  <div class="workout-editor">
    <p>Przygotuj rozpiskę w tempie błyskawicy, wykorzystując innowacyjny edytor treningów. Kopiuj gotowe elementy z poprzednich sesji lub twórz całkowicie nowe.</p>
  <!-- TERMIN  -->
    <h3 class="row j-between a-center">
      <span>Termin</span>
      <span class="row a-center">
        <label class="fs-12 mb0" :class="{ faded: !sticky }" for="checkbox">Przyklejony</label>
        <input id="checkbox" v-model="sticky" type="checkbox">
      </span>
    </h3>
    <div class="row">
      <CustomInput 
        class="mr1"
        icon="clock"
        placeholder="Data"
        v-model="selectedDate"
        type="date"
        :disabled="sticky"
        :show-status="false"
        show-label />
      <CustomInput 
        placeholder="Godzina"
        icon="clock"
        v-model="selectedTime"
        type="time"
        :disabled="sticky"
        :show-status="false" 
        show-label />
    </div>
  <!-- ROZPISKA  -->
    <div class="workout-editor__routine">
      <h3 class="mt0 row j-between" :class="{ blind: editedUnit != null}">
        <span>Rozpiska</span>
        <ContextMenu @toggled="showUnitButtons = $event">
          <template v-slot:trigger>
            <i class="flaticon-vertical-dots"></i>
          </template>
          <template v-slot:options>
            <button :class="{ pb05: showButtonsPanel }" @click="createSection('before')">
              <i class="flaticon-left-arrow-1 fs-12" style="margin-right: .25rem"></i>
              Dodaj sekcję przed
            </button>
            <button :class="{ pb05: showButtonsPanel }" @click="createSection('after')">
              <i class="flaticon-right-arrow-1 fs-12" style="margin-right: .25rem" />
              Dodaj sekcję za
            </button>
            <button :class="{ pb05: showButtonsPanel }" @click="deleteSection">
              <i class="flaticon-trash fs-12" style="margin-right: .25rem"></i>
              Usuń
            </button>
          </template>
        </ContextMenu>
      </h3>
      <transition name="fade">
        <div v-if="!editedUnit">
          <div class="carousel-container" v-if="sections.length > 0">
            <Carousel 
              :pagination="false" 
              :active="!showButtonsPanel && currentComplex == null && !showUnitButtons" 
              :start-from-page="currentSection" 
              :key="sections.length"
              @change-page="currentSection = $event">
              <div class="p01 column" v-for="(section, sectionindex) in sections" :key="sectionindex">
                <div class="tab column fg1">
                  <div class="row j-between">
                    <h4 class="mt0" v-if="currentSection != null">
                      <input 
                        class="input--invisible" 
                        type="text" 
                        placeholder="Nazwa sekcji"
                        v-model="sections[sectionindex].name"
                        spellcheck="false"
                        :ref="`input${sectionindex}`">
                    </h4>
                    <h4 class="mt0" v-else>{{ section.name }}</h4>
                    <i class="flaticon-plus" @click="openUnitEditor()"></i>
                  </div>
                  <div>
                    <div 
                      class="mb05"
                      :class="{ 'blind': currentComplex != null && currentComplex != complexindex }" 
                      v-for="(complex, complexindex) in section.complexes" 
                      :key="complexindex"
                      draggable="true">
                      <h4 class="mt0 mb05 row j-between" :class="{ 't-green': currentComplex == null || currentComplex == complexindex }" v-if="complex.units.length > 1 || currentComplex == complexindex">
                        <input class="input--invisible" v-model="section.complexes[complexindex].name">
                        <i class="flaticon-plus small" @click="currentComplex = complexindex" v-show="currentSection != null && currentComplex != complexindex"></i>
                        <i class="flaticon-accept small" @click="currentComplex = null" v-show="currentSection != null && currentComplex == complexindex"></i>
                      </h4>
                      <ul class="mb05" v-for="(unit, unitindex) in complex.units" :key="unitindex" :class="{ 'pl05': complex.units.length > 1 || currentComplex == complexindex }">
                        <div class="row j-between">
                          <p class="m00">{{ unit.exercise.name }}</p>
                          <ContextMenu 
                            @toggled="showUnitButtons = $event"
                            :bottom="unitindex == complex.units.length - 1 && complexindex == section.complexes.length - 1 && section.complexes.length > 1">
                            <template v-slot:trigger>
                              <i class="flaticon-vertical-dots fs-12"></i>
                            </template>
                            <template v-slot:options>
                              <button @click="moveUnit(sectionindex, complexindex, unitindex, 'up')" v-show="unitindex != 0">
                                <i class="flaticon-up fs-12" style="margin-right: .25rem"></i>
                                Przesuń w górę
                              </button>
                              <button @click="moveUnit(sectionindex, complexindex, unitindex, 'down')" v-show="unitindex != complex.units.length - 1">
                                <i class="flaticon-down-arrow-1 fs-12" style="margin-right: .25rem"></i>
                                Przesuń w dół
                              </button>
                              <button @click="currentComplex = complexindex" v-show="currentComplex == null && complex.units.length < 2">
                                <i class="flaticon-double-arrow-cross-of-shuffle fs-12" style="margin-right: .25rem"></i>
                                Paruj
                              </button>
                              <button @click="openUnitEditor(unit, unitindex, complexindex)">
                                <i class="flaticon-writing fs-12" style="margin-right: .25rem"></i>
                                Edytuj
                              </button>
                              <button @click="deleteUnit(complexindex, unitindex)">
                                <i class="flaticon-trash fs-12" style="margin-right: .25rem"></i>
                                Usuń
                              </button>
                            </template>
                          </ContextMenu>
                        </div>
                        <li>
                          <span v-if="unit.sets">{{ unit.sets }}</span><span v-if="unit.reps">x{{ unit.reps }}</span><span v-if="unit.time">x{{ unit.time }}s</span><span v-if="unit.distance">x{{ unit.distance }}m</span>
                          <span class="t-green" v-if="unit.max && unit.max > 0">(+{{ unit.max }})</span><span class="t-red" v-if="unit.max && unit.max < 0">({{ unit.max }})</span>
                        </li>
                        <li>{{ unit.remarks.toLowerCase() }}</li>
                        <li>
                          <span class="t-gray">przerwy {{ unit.rest }}s</span>
                        </li>
                      </ul>
                    </div>
                    <p class="fs-12 mb0" v-if="section.complexes && section.complexes.length == 0">Na razie brak ćwiczeń.</p>
                  </div>
                </div>
              </div>
            </Carousel>
          </div>
          <p class="m00 tab" v-else>
            Na razie nie dodałeś żadnych sekcji.
          </p>
        <!-- POPRZEDNIE TRENINGI  -->
          <div v-if="user.workouts.length > 0">
            <h3 class="mb0 row j-between">
              <span>Poprzednie treningi</span>
              <span class="row">
                <i class="flaticon-left-arrow" @click="showPreviousWorkout"></i>
                <i class="flaticon-right-arrow" @click="showNextWorkout"></i>
              </span>
            </h3>
            <p class="fs-12 faded" v-if="!user.workouts[currentWorkout].user">
              {{ user.workouts[currentWorkout].scheduled | getDayName }}
              {{ user.workouts[currentWorkout].scheduled | getDayAndMonth }}
            </p>
            <p class="fs-12 faded" v-else>
              {{ user.workouts[currentWorkout].scheduled | getDayName }} 
              {{ user.workouts[currentWorkout].scheduled | getDayAndMonth }} 
              ({{ user.workouts[currentWorkout].user.username }})
            </p>
            <div class="carousel-container" v-if="sections.length > 0">
              <Carousel :pagination="false" :key="previousWorkoutSections.length">
                <div class="p01 column" v-for="section in previousWorkoutSections" :key="section.id">
                  <Routine
                    :section="section" 
                    @copy-unit="addUnit($event)"
                    @copy-section="copySection($event)"
                    @copy-complex="copyComplex($event)" 
                    edit />
                </div>
              </Carousel>
            </div>
          </div>
        </div>
        <UnitEditor 
          :exercises="exercises"
          :editedUnit="editedUnit" 
          @add-unit="addUnit($event)"
          @cancel="closeUnitEditor"
          v-else />
      </transition>
    </div>
  <!-- BUTTONY ZAPISZ ODRZUĆ -->
    <div class="workout-editor__buttons row j-between mt1" :class="{ blind: editedUnit != null}" v-if="!editedUnit">
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
        showUnitEditor: false,
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
        this.showUnitEditor = false;
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

  #checkbox {
    appearance: none;
    padding: 0;
    margin: 0;
    margin-left: 0.5rem;
    border: 1.5px solid white;
    border-radius: 50%;
    height: 10px;
    width: 10px;
    outline: none;
    position: relative;
    transition: background 0.3s;
    &:checked {
      background-color: white;
    }
  }

  .workout-editor__buttons button {
    width: 49%;
  }
</style>