<template>
  <div class="workout-editor">
  <!-- TERMIN  -->
    <Head class="pt05 pb05">
      <div class="row j-between">
        <span>Termin</span>
        <!-- <Radio :value="sticky" @change-value="sticky = $event" v-if="user.homeworks.length == 0 || showSticky"> -->
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
      <Head>
        <div class="row j-between">
          <h3 class="m00">Rozpiska</h3>
          <i class="flaticon-vertical-dots" @click="showButtonsPanel = !showButtonsPanel"></i>
        </div>
        <transition name="accordion">
          <div class="workout-editor__panel row mt05 t-small" v-if="showButtonsPanel">
            <template v-if="!editSection">
              <button :class="{ pb05: showButtonsPanel }" @click="createSection">Dodaj</button>
              <button :class="{ pb05: showButtonsPanel }" @click="openEditSection">Edytuj</button>
              <button :class="{ pb05: showButtonsPanel }" @click="deleteSection">Usuń</button>
            </template>
            <template v-else>
              <button :class="{ pb05: showButtonsPanel }" @click="closeEditSection('save')">Zapisz</button>
              <button :class="{ pb05: showButtonsPanel }" @click="closeEditSection('abort')">Wróć</button>
            </template>
          </div>
        </transition>
      </Head>
      <Carousel 
        :pagination="false" 
        :active="!showButtonsPanel" 
        :custom-length="sections.length" 
        :start-from-page="currentTranslate" 
        @change-page="currentTranslate = $event"
        v-if="sections.length > 0">
        <div class="tab" v-for="(section, sectionindex) in sections" :key="sectionindex">
          <div class="row j-between">
            <h3 class="mt0" v-if="editSection">
              <input 
                class="input--invisible" 
                type="text" 
                placeholder="Nowa sekcja"
                :value="sections[sectionindex].name"
                spellcheck="false"
                :ref="`input${sectionindex}`">
            </h3>
            <h3 class="mt0" v-else>
              {{ section.name }}
            </h3>
            <div v-if="!editSection">
              <i class="flaticon-plus" @click="editComplexes(sectionindex)" v-show="currentSection == null"></i>
              <i class="flaticon-accept" @click="stopEditComplexes(sectionindex)" v-show="currentSection != null"></i>
            </div>
          </div>
          <div>
            <div class="mb05" v-for="(complex, complexindex) in section.complexes" :key="complexindex" :class="{ 'blind': currentComplex != null && currentComplex != complexindex }">
              <h4 class="mt0 mb05 row j-between" :class="{ 't-green': currentComplex == null || currentComplex == complexindex }" v-if="complex.units.length > 1 || currentComplex != null">
                {{ complex.name }}
                <i class="flaticon-next small" @click="currentComplex = complexindex" v-show="currentSection != null && currentComplex != complexindex"></i>
                <i class="flaticon-accept small" @click="currentComplex = null" v-show="currentSection != null && currentComplex == complexindex"></i>
              </h4>
              <ul class="mb05" v-for="(unit, unitindex) in complex.units" :key="unitindex" :class="{ 'pl05': complex.units.length > 1 || currentComplex == complexindex }">
                <p class="m00 row j-between">
                  <span>{{ unit.exercise.name }}</span>
                  <span v-show="currentSection != null">
                    <i class="flaticon-next small" @click="currentComplex = complexindex" v-show="currentComplex == null && complex.units.length < 2"></i>
                    <i class="flaticon-close small" @click="deleteUnit(complexindex, unitindex)"></i>
                  </span>
                </p>
                <li><span v-if="unit.sets">{{ unit.sets }}</span><span v-if="unit.reps">x{{ unit.reps }}</span><span v-if="unit.time">x{{ unit.time }}s</span><span v-if="unit.distance">x{{ unit.distance }}m</span></li>
                <li>{{ unit.remarks }}</li>
              </ul>
            </div>
            <p class="m00 t-small" v-if="section.complexes && section.complexes.length == 0">Na razie brak ćwiczeń.</p>
          </div>
        </div>
      </Carousel>
      <p class="m00 tab" v-else>
        Na razie nie dodałeś żadnych sekcji.
      </p>
    </div>
  <!-- SKILLSET I POPRZEDNIE TRENINGI  -->
    <div v-if="currentSection != null && !editSection">
      <div class="pl1 pr1 column t-gray t-small mb05">
        <button class="t-small" type="button" @click="showSkillset = !showSkillset">
          Dotknij tutaj, by zmienić okno
          <span v-if="!showSkillset">(Ostatni trening)</span>
          <span v-else>(Umiejętności)</span>
        </button>
        <div class="mt05 row j-around" v-if="!showSkillset">
          <button 
            type="button"
            class="t-small"
            :class="{ 't-green': index == currentWorkout }"
            v-for="(date, index) in previousWorkoutsDates" 
            :key="index"
            @click="currentWorkout = index">{{ date | reverseDate }}</button>
        </div>
      </div>
      <transition name="fade" mode="out-in">
        <Skills :skill-data="user.skill" @copy-unit="addUnit($event)" v-if="showSkillset" />
        `<Carousel :pagination="false" v-if="!showSkillset">
          <Routine 
            v-for="section in user.workouts[this.currentWorkout].sections" 
            :key="section.id" 
            :section="section" 
            @copy-section="copySection($event)"
            @copy-complex="copyComplex($event)" 
            edit />
        </Carousel>
      </transition>
    </div>
  <!-- PRZERWY  -->
    <Head class="pt05 pb05 b-black" v-if="sections.length > 0">
      <div class="row j-between">
        <span>Odpoczynek</span>
        <div class="row">
          <i class="flaticon-up-arrow small" @click="sections[currentTranslate].rest += 5"></i>
          <span class="pl05 pr05">{{ sections[currentTranslate].rest }}s</span>
          <i class="flaticon-down-arrow small" @click="sections[currentTranslate].rest -= 5"></i>
        </div>
      </div>
    </Head>
  <!-- BUTTONY ZAPISZ ODRZUĆ -->
    <div class="workout-editor__buttons tab p00 row j-between t-green mt05">
      <button class="p11" type="button" @click="uploadWorkout">Zapisz</button>
      <button class="p11" type="button" @click="$router.go(-1)">Wróć</button>
    </div>
  </div>
</template>

<script>
import Skills from '~/components/Skills.vue';
import createWorkout from '~/apollo/mutations/createWorkout.gql';
import updateWorkout from '~/apollo/mutations/updateWorkout.gql';
import Routine from '~/components/Routine';
import Radio from '~/components/Radio';

export default {
  components: {
    Skills,
    Routine, 
    Radio,
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
      initialSectionsLength: this.specificData.sections.length, 
      showSkillset: true, 
      editSection: false, 
      showButtonsPanel: false,
      currentWorkout: 0,
      currentSection: null, 
      currentComplex: null,
      currentTranslate: 0, 
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
            sectionsClone[sectionindex].complexes[complexindex].units[unitindex] = _.omit(unit, '__typename', 'id');
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
    previousWorkoutsDates() {
      let previousWorkoutsDates = [];
      this.user.workouts.forEach(cur => {
        previousWorkoutsDates.push(cur.scheduled);
      });
      return previousWorkoutsDates;
    }
  },
  methods: {
    createSection() {
      const newSection = {
        name: 'Nowa sekcja',
        rest: 180, 
      };
      this.sections.push(newSection);
      this.editSection = true;
      this.currentSection = this.sections.length - 1;
      this.currentTranslate = this.sections.length - 1;
      setTimeout(() => {
        let input = `input${this.sections.length - 1}`;
        this.$refs[input][0].focus();
      }, 700);
    },
    deleteSection() {
      if (confirm("Czy na pewno chcesz usunąć ten element?")) {
        this.sections.splice(this.currentTranslate, 1);
      }
      this.showButtonsPanel = false;
    },
    openEditSection() {
      this.editSection = true;
      setTimeout(() => {
        let input = `input${this.currentTranslate}`;
        this.$refs[input][0].focus();
      }, 700);
    },
    closeEditSection(mode) {
      this.editSection = false;
      this.showButtonsPanel = false;
      let input = `input${this.currentTranslate}`
      const inputValue = this.$refs[input][0].value;
      if (mode == 'save') {
        this.sections[this.currentTranslate].name = inputValue;
        this.editSection = false;
        this.currentSection = null;
        if (!this.sections[this.currentTranslate].complexes) {
          this.$set(this.sections[this.currentTranslate], 'complexes', []);
        }
      } else {
        this.currentSection = null;
        if (!this.sections[this.currentTranslate].complexes) {
          this.sections.splice(this.currentTranslate, 1);
          this.currentTranslate = 0;
        } else {
          this.editSection = false;
        }
      }
    },
    editComplexes(sectionindex) {
      this.currentSection = sectionindex;
    },
    stopEditComplexes() {
      this.currentSection = null;
      this.currentComplex = null;
    },
    addUnit(unit) {
      if (this.currentComplex != null) {
        this.sections[this.currentSection].complexes[this.currentComplex].units.push(unit);
      } else {
        const newComplex = {
          name: "Kompleks", 
          units: [
            unit
          ]
        }
        this.sections[this.currentSection].complexes.push(newComplex);
      }
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
    }
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

  .workout-editor__buttons button {
    width: 50%;
  }
</style>