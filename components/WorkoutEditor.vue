<template>
  <article class="workout-editor">
    <p class="mb0">Przygotuj rozpiskę w tempie błyskawicy, wykorzystując innowacyjny edytor treningów. Kopiuj gotowe elementy z poprzednich sesji lub twórz całkowicie nowe.</p>
    <section> 
      <header>
        <h4 class="t-faded m00 pt1 pb05">Termin</h4>
      </header>
      <div class="inputs">
        <div class="row">
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
        <CustomInput 
          placeholder="Nazwa treningu"
          v-model="name"
          type="text"
          :show-status="false"
          v-show="sticky" />
      </div>
    </section>
    <section>
      <header class="row j-between a-center t-faded pt1 pb05">
        <h4 class="m00 t-faded">Sekcje</h4>
        <button class="flaticon-plus" type="button" @click="createSection"></button>
      </header>
      <div class="carousel-container b-secondary">
        <Carousel
          :navigation-config="carouselNavConfig"
          :blocked="currentComplex != null" 
          :start-from-page="currentSection"
          @change-page="currentSection = $event"
          v-if="sections.length > 0">
          <div class="p11 column" v-for="(section, sectionindex) in sections" :key="sectionindex">
            <Routine :section="section" :current-complex="currentComplex">
              <template v-slot:section-buttons>
                <ContextMenu>
                  <template v-slot:trigger>
                    <span class="flaticon-vertical-dots"></span>
                  </template>
                  <template v-slot:options>
                    <button class="flaticon-add-button" @click="openUnitEditor()">
                      Dodaj ćwiczenie
                    </button>
                    <button class="flaticon-left-arrow-1" @click="moveSection('left')" v-show="currentSection > 0">
                      Przesuń w lewo
                    </button>
                    <button class="flaticon-right-arrow-2" @click="moveSection('right')" v-show="currentSection < sections.length - 1">
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
                <ContextMenu
                  v-show="currentComplex != complexindex">
                  <template v-slot:trigger>
                    <span class="flaticon-vertical-dots fs-12"></span>
                  </template>
                  <template v-slot:options>
                    <button class="flaticon-double-arrow-cross-of-shuffle" @click="currentComplex = complexindex" v-if="user.workouts.length > 1">
                      Kopiuj ćwiczenie
                    </button>
                    <button class="flaticon-add-button" @click="addExerciseToComplex(complexindex)">
                      Dodaj ćwiczenie
                    </button>
                    <button class="flaticon-up" @click="moveComplex(currentSection, complexindex, 'up')" v-show="complexindex != 0">
                      Przesuń w górę
                    </button>
                    <button class="flaticon-down-arrow-1" @click="moveComplex(currentSection, complexindex, 'down')" v-show="complexindex != section.complexes.length - 1">
                      Przesuń w dół
                    </button>
                    <button class="flaticon-pencil" @click="openNameEditor(complexindex)">
                      Zmień nazwę
                    </button>
                    <button class="flaticon-trash" @click="deleteComplex(complexindex)">
                      Usuń
                    </button>
                  </template>
                </ContextMenu>
                <button class="flaticon-tick fs-12" type="button" @click="currentComplex = null" v-show="currentComplex == complexindex"></button>
              </template>
              <template v-slot:unit-buttons="{ unit, unitindex, complex, complexindex }">
                <ContextMenu 
                  :bottom="
                    unitindex == complex.units.length - 1
                    && complexindex == section.complexes.length - 1
                    && unitindex + complexindex > 0">
                  <template v-slot:trigger>
                    <span class="flaticon-vertical-dots fs-12"></span>
                  </template>
                  <template v-slot:options>
                    <button class="flaticon-up" @click="moveUnit(currentSection, complexindex, unitindex, 'up')" v-show="unitindex != 0">
                      Przesuń w górę
                    </button>
                    <button class="flaticon-down-arrow-1" @click="moveUnit(currentSection, complexindex, unitindex, 'down')" v-show="unitindex != complex.units.length - 1">
                      Przesuń w dół
                    </button>
                    <template v-show="complex.units.length == 1">
                      <button class="flaticon-up" @click="moveComplex(currentSection, complexindex, 'up')" v-show="complexindex != 0">
                        Przesuń w górę
                      </button>
                      <button class="flaticon-down-arrow-1" @click="moveComplex(currentSection, complexindex, 'down')" v-show="complexindex != section.complexes.length - 1">
                        Przesuń w dół
                      </button>
                    </template>
                    <template v-if="currentComplex == null && complex.units.length < 2">
                      <button class="flaticon-add-button" @click="addExerciseToComplex(complexindex)">
                        Dodaj ćwiczenie
                      </button>
                      <button class="flaticon-double-arrow-cross-of-shuffle" @click="currentComplex = complexindex" v-if="user.workouts.length > 0">
                        Paruj
                      </button>
                    </template>
                    <button class="flaticon-pencil" @click="openUnitEditor(unit, unitindex, complexindex)">
                      Edytuj
                    </button>
                    <button class="flaticon-trash" @click="deleteUnit(complexindex, unitindex)">
                      Usuń
                    </button>
                  </template>
                </ContextMenu>
              </template>
            </Routine>
          </div>
        </Carousel>
        <p class="m00 p11" v-else>
          Na razie nie dodałeś żadnych sekcji.
        </p>
      </div>
    </section>
    <!-- POPRZEDNIE TRENINGI  -->
    <section v-if="user.workouts.length > 0">
      <header class="row j-between a-center pt1 t-faded" :class="{ pb05: !user.workouts[currentWorkout].feedback }">
        <h4 class="mb0 t-faded" v-if="!user.workouts[currentWorkout].user">
          {{ user.workouts[currentWorkout].scheduled | getDayName }}
          {{ user.workouts[currentWorkout].scheduled | getDayAndMonth }}
        </h4>
        <h4 class="mb0 t-faded" v-else>
          {{ user.workouts[currentWorkout].scheduled | getDayName }} 
          {{ user.workouts[currentWorkout].scheduled | getDayAndMonth }} 
          ({{ user.workouts[currentWorkout].user.username }})
        </h4>
        <!-- <button type="button" @click="feedbackVisible = !feedbackVisible">notatka</button> -->
        <div class="row">
          <button class="flaticon-left-arrow" type="button" @click="showPreviousWorkout"></button>
          <button class="flaticon-right-arrow" type="button" @click="showNextWorkout"></button>
        </div>
      </header>
      <p class="t-faded fs-13 mb05" v-show="user.workouts[currentWorkout].feedback">{{ user.workouts[currentWorkout].feedback}}</p>
      <div class="carousel-container b-secondary" v-if="previousWorkoutSections.length > 0">
        <Carousel 
          :navigation-config="carouselNavConfig" 
          :key="previousWorkoutSections.length">
          <div class="p11 column" v-for="section in previousWorkoutSections" :key="section.id">
            <Routine :section="section">
              <template v-slot:section-buttons>
                <button class="flaticon-plus" type="button" @click="copySection(section)"></button>
              </template>
              <template v-slot:complex-buttons="{ complex }">
                <button class="flaticon-plus" type="button" @click="copyComplex(complex)"></button>
              </template>
              <template v-slot:unit-buttons="{ unit }">
                <button class="flaticon-plus" type="button" @click="addUnit(unit)"></button>
              </template>
            </Routine>
          </div>
        </Carousel>
      </div>
    </section>
    <Modal :show="Boolean(editedUnit)" @close="closeUnitEditor">
      <UnitEditor 
        :exercises="exercises"
        :editedUnit="editedUnit" 
        @add-unit="addUnit($event)"
        @cancel="closeUnitEditor">
      </UnitEditor>
    </Modal>
    <Modal :show="nameEditorVisible" @close="nameEditorVisible = false">
      <NameEditor 
        :name="currentComplex == null ? sections[currentSection].name : sections[currentSection].complexes[currentComplex].name"
        @name-edited="closeNameEditor($event)"
        @close="closeNameEditor">
      </NameEditor>
    </Modal>
  <!-- BUTTONY ZAPISZ ODRZUĆ -->
    <section class="buttons">
      <button class="button-primary" type="button" @click="uploadWorkout">Zapisz</button>
      <button class="button-primary" type="button" @click="$router.go(-1)">Wróć</button>
    </section>
  </article>
</template>

<script>
  import NameEditor from '~/components/NameEditor.vue';
  import exercisesQuery from '~/apollo/queries/users/_id/exercises.gql';
  import getUserQuery from '~/apollo/queries/users/_id/main.gql';
  import getWorkoutsQuery from '~/apollo/queries/workouts/new/main.gql';
  import createWorkout from '~/apollo/mutations/createWorkout.gql';
  import updateWorkout from '~/apollo/mutations/updateWorkout.gql';
  
  export default {
    components: { NameEditor },
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
        currentSection: 0, 
        currentComplex: null,
        currentUnit: null,
        currentWorkout: 0,
        exercises: null,
        editedUnit: null, 
        nameEditorVisible: false,
        feedbackVisible: false,
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
      },
      carouselNavConfig() {
        return {
          height: '2px',
          margin: '0',
          borderRadius: '0',
          activeColor: '#FDDCBD',
          fullWidth: true,
        }
      }
    },
    methods: {
      createSection(index) {
        const newSection = {
          name: 'Nowa sekcja',
          complexes: [],
        };
        this.sections.push(newSection);
        this.currentSection = this.sections.length - 1;
      },
      moveSection(direction) {
        let sectionToMove = this.sections[this.currentSection];
        let newIndex = direction == 'left' ? this.currentSection - 1 : this.currentSection + 1;
        this.sections.splice(this.currentSection, 1);
        this.sections.splice(newIndex, 0, sectionToMove);
        this.currentSection = newIndex;
      },
      deleteSection() {
        this.sections.splice(this.currentSection, 1);
        this.currentSection = this.currentSection == 0 ? 0 : this.currentSection - 1;
      },
      copySection(section) {
        const sectionClone = JSON.parse(JSON.stringify(section));
        this.sections[this.currentSection].complexes.push(...sectionClone.complexes);
        this.sections[this.currentSection].name = sectionClone.name;
      },
      moveComplex(sectionindex, complexindex, direction) {
        let currentComplexes = this.sections[sectionindex].complexes;
        let complexToMove = currentComplexes[complexindex];
        let newIndex = direction == 'up' ? complexindex - 1 : complexindex + 1;
        
        currentComplexes.splice(complexindex, 1);
        currentComplexes.splice(newIndex, 0, complexToMove);
      },  
      deleteComplex(complexindex) {
        this.sections[this.currentSection].complexes.splice(complexindex, 1);
        this.currentComplex = null;
      },
      copyComplex(complex) {
        const complexClone = JSON.parse(JSON.stringify(complex));
        this.sections[this.currentSection].complexes.push(complexClone);
      },
      addExerciseToComplex(complexindex) {
        this.currentComplex = complexindex;
        this.openUnitEditor();
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
      openNameEditor(complex) {
        if (complex != undefined) this.currentComplex = complex; 
        this.nameEditorVisible = true;
      },
      closeNameEditor(name) {
        if (this.currentComplex != null && name) {
          this.sections[this.currentSection].complexes[this.currentComplex].name = name;
          this.currentComplex = null;
        } else if (!this.currentComplex && name) {
          this.sections[this.currentSection].name = name;
        }
        this.nameEditorVisible = false;
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
              name: this.name,
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
              name: this.name,
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
    width: 100vw;
    margin-left: -1rem;
    padding: 1rem;
    padding-bottom: .5rem;
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
    button {
      width: 49%;
    }
  }
</style>