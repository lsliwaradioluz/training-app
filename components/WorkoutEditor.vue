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
            <button :class="{ pb05: showButtonsPanel }" @click="createSection">Dodaj</button>
            <button :class="{ pb05: showButtonsPanel }" @click="deleteSection">Usuń</button>
          </div>
        </transition>
      </Head>
      <transition name="fade">
        <div v-if="!editedUnit">
          <Carousel 
            :pagination="false" 
            :active="!showButtonsPanel && currentComplex == null" 
            :custom-length="sections.length" 
            :start-from-page="currentSection" 
            @change-page="currentSection = $event"
            v-if="sections.length > 0">
            <div class="tab" v-for="(section, sectionindex) in sections" :key="sectionindex">
              <div class="row j-between">
                <h3 class="mt0" v-if="currentSection != null">
                  <input 
                    class="input--invisible" 
                    type="text" 
                    placeholder="Nazwa sekcji"
                    v-model="sections[currentSection].name"
                    spellcheck="false"
                    :ref="`input${sectionindex}`">
                </h3>
                <h3 class="mt0" v-else>{{ section.name }}</h3>
                <i class="flaticon-plus" @click="openUnitEditor()"></i>
              </div>
              <div>
                <div class="mb05" v-for="(complex, complexindex) in section.complexes" :key="complexindex" :class="{ 'blind': currentComplex != null && currentComplex != complexindex }">
                  <h4 class="mt0 mb05 row j-between" :class="{ 't-green': currentComplex == null || currentComplex == complexindex }" v-if="complex.units.length > 1 || currentComplex == complexindex">
                    {{ complex.name }}
                    <i class="flaticon-plus small" @click="currentComplex = complexindex" v-show="currentSection != null && currentComplex != complexindex"></i>
                    <i class="flaticon-accept small" @click="currentComplex = null" v-show="currentSection != null && currentComplex == complexindex"></i>
                  </h4>
                  <ul class="mb05" v-for="(unit, unitindex) in complex.units" :key="unitindex" :class="{ 'pl05': complex.units.length > 1 || currentComplex == complexindex }">
                    <div class="row j-between">
                      <p class="m00">{{ unit.exercise.name }}</p>
                      <div class="workout-editor__unit-buttons">
                        <i 
                          class="workout-editor__unit-button flaticon-vertical-dots small" 
                          @click="showUnitButtons == `${complexindex}${unitindex}` ? showUnitButtons = null : showUnitButtons = `${complexindex}${unitindex}`" ></i>
                        <transition name="roll">
                          <div class="row" v-if="showUnitButtons == `${complexindex}${unitindex}`">
                            <button class="m00 mr05" @click="currentComplex = complexindex" v-show="currentComplex == null && complex.units.length < 2">Paruj</button>
                            <button class="m00 mr05 ml0" @click="deleteUnit(complexindex, unitindex)">Usuń</button>
                            <button class="m00 ml0" @click="openUnitEditor(unit, unitindex, complexindex)">Edytuj</button>
                          </div>
                        </transition>
                      </div>
                    </div>
                    <li>
                      <span v-if="unit.sets">{{ unit.sets }}</span><span v-if="unit.reps">x{{ unit.reps }}</span><span v-if="unit.time">x{{ unit.time }}s</span><span v-if="unit.distance">x{{ unit.distance }}m</span>
                      <span class="t-green" v-if="unit.max && unit.max > 0">(+{{ unit.max }})</span><span class="t-red" v-if="unit.max && unit.max < 0">({{ unit.max }})</span>
                    </li>
                    <li>{{ unit.remarks }}</li>
                    <li>
                      <span class="t-gray">przerwy {{ unit.rest }}s</span>
                    </li>
                  </ul>
                </div>
                <p class="m00 t-small" v-if="section.complexes && section.complexes.length == 0">Na razie brak ćwiczeń.</p>
              </div>
            </div>
          </Carousel>
          <p class="m00 tab" v-else>
            Na razie nie dodałeś żadnych sekcji.
          </p>
        <!-- POPRZEDNIE TRENINGI  -->
          <div v-if="previousWorkouts.length > 0">
            <div class="mb05 row j-between t-gray">
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
            <Carousel :pagination="false" :custom-length="previousWorkoutSections.length">
              <Routine 
                v-for="section in previousWorkoutSections" 
                :key="section.id" 
                :section="section" 
                @copy-unit="addUnit($event)"
                @copy-section="copySection($event)"
                @copy-complex="copyComplex($event)" 
                edit />
            </Carousel>
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
    <div class="workout-editor__buttons tab p00 row j-between t-green mt05" :class="{ blind: editedUnit != null}">
      <button class="p11" type="button" @click="uploadWorkout">Zapisz</button>
      <button class="p11" type="button" @click="$router.go(-1)">Wróć</button>
    </div>
  </div>
</template>

<script>
import Skills from '~/components/Skills.vue';
import exercisesQuery from '~/apollo/queries/users/_name/exercises.gql';
import createWorkout from '~/apollo/mutations/createWorkout.gql';
import updateWorkout from '~/apollo/mutations/updateWorkout.gql';
import Routine from '~/components/Routine';
import Radio from '~/components/Radio';
import UnitEditor from '~/components/UnitEditor';

export default {
  components: {
    Skills,
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
      sectionBeforeEdit: null,
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
    createSection() {
      const newSection = {
        name: 'Nowa sekcja',
        complexes: [],
      };
      this.sections.push(newSection);
      this.currentSection = this.sections.length - 1;
      this.showButtonsPanel = false;
      setTimeout(() => {
        let input = `input${this.sections.length - 1}`;
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
      if (this.currentComplex == null && this.currentUnit == null) {
        const newComplex = {
          name: "Blok", 
          units: [
            unit
          ]
        }
        this.sections[this.currentSection].complexes.push(newComplex);
      } else if (this.currentComplex != null && this.currentUnit == null) {
        this.sections[this.currentSection].complexes[this.currentComplex].units.push(unit);
      } else {
        this.sections[this.currentSection].complexes[this.currentComplex].units[this.currentUnit] = unit;
        this.currentComplex = null;
        this.currentUnit = null;
      }
      this.editedUnit = null;
    },
    deleteUnit(complex, unit) {
      this.sections[this.currentSection].complexes[complex].units.splice(unit, 1);
      if (this.sections[this.currentSection].complexes[complex].units.length == 0) { 
        this.sections[this.currentSection].complexes.splice(complex, 1);
      }
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

      this.client.mutate({ mutation: this.edit ? updateWorkout : createWorkout, variables: { input: input }  })
        .then(res => {
          this.$router.go(-1);
        })  
    }, 
    showPreviousWorkout() {
      this.currentWorkout == 0 ? this.currentWorkout = 0 : this.currentWorkout--
    },
    showNextWorkout() {
      this.currentWorkout == this.previousWorkouts.length - 1 ? this.currentWorkout = this.previousWorkouts.length - 1 : this.currentWorkout++
    }, 
  }, 
  mounted() {
    window.addEventListener('click', () => {
      if (!event.target.classList.contains('workout-editor__unit-button')) {
        this.showUnitButtons = null;
      }
    });
  }
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

  .workout-editor__unit-buttons {
    position: relative;
    div {
      background-color: white;
      color: color(black);
      border-radius: 5px;
      position: absolute;
      right: 125%;
      top: 0;
      padding: 0.3rem;
    }
  }

  .workout-editor__buttons button {
    width: 50%;
  }
</style>