<template>
  <div class="workout-editor">
  <!-- TERMIN  -->
    <Head class="pt05 pb05">
      <div class="row j-between">
        <span>Termin</span>
        <Radio :value="sticky" @change-value="sticky = $event">
          <template v-slot:first>sticky</template>
          <template v-slot:second>not</template>
        </Radio>
      </div>
    </Head>
    <div class="row mb05" v-if="!sticky">
      <input class="mr05 b-lightblack" type="date" v-model="selectedDate">
      <input class="b-lightblack" type="time" v-model="selectedTime">
    </div>
  <!-- ROZPISKA  -->
    <div class="workout-editor__routine">
      <Head :class="{ blind: editedUnit != null}">
        <div class="row j-between">
          <h3 class="m00">Rozpiska</h3>
          <i class="flaticon-vertical-dots" @click="showButtonsPanel = !showButtonsPanel"></i>
        </div>
        <transition name="accordion">
          <div class="workout-editor__panel row mt05 t-small" v-if="showButtonsPanel">
            <button :class="{ pb05: showButtonsPanel }" @click="createSection('before')">
              <i class="flaticon-left-arrow fs-05" />
              <span>Dodaj</span>
            </button>
            <button :class="{ pb05: showButtonsPanel }" @click="deleteSection">Usuń</button>
            <button :class="{ pb05: showButtonsPanel }" @click="createSection('after')">
              <span>Dodaj</span>
              <i class="flaticon-right-arrow fs-05" />
            </button>
          </div>
        </transition>
      </Head>
      <transition name="fade">
        <div v-if="!editedUnit">
        <div class="carousel-container" v-if="sections.length > 0">
          <Carousel 
            :pagination="false" 
            :active="!showButtonsPanel && currentComplex == null" 
            :start-from-page="currentSection" 
            :key="sections.length"
            @change-page="currentSection = $event">
            <div class="p01 column" v-for="(section, sectionindex) in sections" :key="sectionindex">
              <div class="tab column fg1">
                <div class="row j-between">
                  <h3 class="mt0" v-if="currentSection != null">
                    <input 
                      class="input--invisible" 
                      type="text" 
                      placeholder="Nazwa sekcji"
                      v-model="sections[sectionindex].name"
                      spellcheck="false"
                      :ref="`input${sectionindex}`">
                  </h3>
                  <h3 class="mt0" v-else>{{ section.name }}</h3>
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
                        <ContextMenu small-icon>
                          <button class="mr05 ml05" @click="moveUnit(sectionindex, complexindex, unitindex, 'up')" v-show="unitindex != 0">W górę</button>
                          <button class="mr05 ml05" @click="moveUnit(sectionindex, complexindex, unitindex, 'down')" v-show="unitindex != complex.units.length - 1">W dół</button>
                          <button class="mr05 ml05" @click="currentComplex = complexindex" v-show="currentComplex == null && complex.units.length < 2">Paruj</button>
                          <button class="mr05 ml05" @click="deleteUnit(complexindex, unitindex)">Usuń</button>
                          <button class="mr05 ml05" @click="openUnitEditor(unit, unitindex, complexindex)">Edytuj</button>
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
                  <p class="m00 t-small" v-if="section.complexes && section.complexes.length == 0">Na razie brak ćwiczeń.</p>
                </div>
              </div>
            </div>
          </Carousel>
        </div>
          <p class="m00 tab" v-else>
            Na razie nie dodałeś żadnych sekcji.
          </p>
        <!-- POPRZEDNIE TRENINGI  -->
          <div v-if="previousWorkouts.length > 0">
            <div class="mb05 row j-between a-center t-gray">
              <i class="flaticon-left-arrow" @click="showPreviousWorkout"></i>
              <span v-if="!previousWorkouts[currentWorkout].user">
                {{ previousWorkouts[currentWorkout].scheduled | getShortDayName }}
                {{ previousWorkouts[currentWorkout].scheduled | getDayAndMonth }}
              </span>
              <span v-else>
                {{ previousWorkouts[currentWorkout].scheduled | getShortDayName }} 
                {{ previousWorkouts[currentWorkout].scheduled | getDayAndMonth }} 
                ({{ previousWorkouts[currentWorkout].user.username }})
              </span>
              <i class="flaticon-right-arrow" @click="showNextWorkout"></i>
            </div>
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
    <div class="workout-editor__buttons tab p00 row j-between t-green" :class="{ blind: editedUnit != null}">
      <button class="p11" type="button" @click="uploadWorkout">Zapisz</button>
      <button class="p11" type="button" @click="$router.go(-1)">Wróć</button>
    </div>
  </div>
</template>

<script>
import exercisesQuery from '~/apollo/queries/users/_name/exercises.gql';
import mainQuery from '~/apollo/queries/users/_name/main.gql';
import createWorkout from '~/apollo/mutations/createWorkout.gql';
import updateWorkout from '~/apollo/mutations/updateWorkout.gql';
import Routine from '~/components/Routine';
import Radio from '~/components/Radio';
import UnitEditor from '~/components/UnitEditor';

export default {
  components: {
    Routine, 
    Radio,
    UnitEditor, 
  },
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
      return this.sections.length > 0 ? true : false;
    },
    previousWorkoutSections() {
      const previousWorkoutSections = this.previousWorkouts[this.currentWorkout].sections.filter(section => {
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
          update: (store, { data: { createWorkout } }) => {
            // read data from cache for this query
            const data = store.readQuery({ query: mainQuery, variables: { username:  this.user.username } });
            // push new item to the data read from the cache 
            data.users[0].workouts.unshift(createWorkout.workout);
            // write data back to cache 
            store.writeQuery({ query: mainQuery, data })
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
      this.currentWorkout == this.previousWorkouts.length - 1 ? this.currentWorkout = this.previousWorkouts.length - 1 : this.currentWorkout++
    }, 
  }, 
}
</script>

<style lang="scss" scoped>

  .workout-editor__panel {
    border-top: 1px solid color(gray);
    button {
      padding: 1rem;
      flex-basis: 50%;
      font-size: inherit;
    }
  }

  .workout-editor__buttons button {
    width: 50%;
  }
</style>