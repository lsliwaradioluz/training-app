<template>
  <div class="workout-editor">
  <!-- TERMIN  -->
    <Head class="pt05 pb05">
      <div class="row j-between">
        <span>Termin</span>
        <Radio :value="sticky" @change-value="sticky = $event" v-if="user.homeworks.length == 0 || showSticky">
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
    <Carousel :pagination="false " :active="currentSection == null">
      <div class="column" v-for="(section, key) in workout" :key="key">
        <Head class="pt05 pb05">
          <div class="row j-between">
            <h3 class="m00">{{ key }}</h3>
            <i class="flaticon-adjust" @click="openSectionEdit(key)" v-if="!currentSection"></i>
            <i class="flaticon-accept" @click="closeSectionEdit" v-else></i>
          </div>
        </Head>
        <div class="workout-editor__blocks tab p11">
          <p class="m00" v-if="section.length == 0">Na razie brak ćwiczeń</p>
          <div v-for="(block, blockindex) in section" :key="blockindex" :class="{ 'blind': currentBlock != null && currentBlock != blockindex }">
            <h4 class="mt0 mb05 row j-between t-green" v-if="block.units.length > 1 || currentBlock == blockindex">
              <span>{{ block.name }}</span>
              <i class="flaticon-next small" @click="currentBlock = blockindex" v-if="currentSection && currentBlock != blockindex"></i>
              <i class="flaticon-accept small" @click="currentBlock = null" v-if="currentSection && currentBlock == blockindex"></i>
            </h4>
            <ul class="mb05" :class="{ pl05:  block.units.length > 1 || currentBlock == blockindex }" v-for="(unit, unitindex) in block.units" :key="unitindex">
              <p class="mb0 row j-between">
                {{ unit.exercise.name }}
                <span>
                  <i class="flaticon-next small" @click="currentBlock = blockindex" v-if="currentSection && block.units.length == 1 && currentBlock != blockindex"></i>
                  <i class="flaticon-close small" @click="deleteUnit(blockindex, unitindex)" v-if="currentSection"></i>
                </span>
              </p>
              <li>
                <span v-if="unit.sets">{{ unit.sets }}</span><span v-if="unit.reps">x{{ unit.reps }}</span><span v-if="unit.time">x{{ unit.time }}s</span><span v-if="unit.distance">{{ unit.distance }}m</span>
              </li>
              <li>
                <span v-if="unit.remarks">{{ unit.remarks }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Carousel>
  <!-- SKILLSET I POPRZEDNIE TRENINGI  -->
    <div v-if="currentSection">
      <div class="pl1 pr1 column t-gray t-small mb05">
        <button class="t-small" type="button" @click="showSkillset = !showSkillset" v-if="previousWorkoutSections != null">
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
        <Skills :skillset="user.skill" @copy-unit="copyUnit($event)" v-if="showSkillset" />
        <Carousel :pagination="false" v-if="!showSkillset && previousWorkoutSections">
          <Routine 
            v-for="(section, key) in previousWorkoutSections" 
            :key="key" 
            :section="section" 
            :section-name="key"
            edit
            @copy-section="copySection($event)"
            @copy-block="copyBlock($event)" />
        </Carousel>
      </transition>
    </div>
  <!-- ODPOCZYNEK  -->
    <div>
      <Head class="pt05 pb05 b-black">Odpoczynek</Head>
      <div class="tab p11">
        <div class="row j-between">
          <div class="workout-editor__rest column a-center j-center" v-for="(restInterval, key) in restIntervals" :key="key">
            <p>{{ key | englishToPolish }}</p>
            <p @click="restIntervals[key] += 5"><i class="flaticon-up-arrow"></i></p>
            <p>{{ restInterval }}s</p>
            <p class="mb0" @click="restIntervals[key] -= 5"><i class="flaticon-down-arrow"></i></p>
          </div>
        </div>
      </div>
    </div>
  <!-- BUTTONY ZAPISZ ODRZUĆ -->
    <div class="workout-editor__buttons tab p00 row j-between t-green">
      <button class="p11" type="button" @click.once="uploadWorkout">Zapisz</button>
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
      showSkillset: true, 
      currentWorkout: 0,
    }
  },
  computed: {
    dateAndTime() {
      return new Date(this.selectedDate + " " + this.selectedTime);
    },
    workoutReady() {
      if (this.workout.warmup.length + this.workout.skillwork.length + this.workout.strength.length + this.workout.cardio.length + this.workout.mobility.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    previousWorkoutsDates() {
      let previousWorkoutsDates = [];
      this.user.workouts.forEach(cur => {
        previousWorkoutsDates.push(cur.scheduled);
      });
      return previousWorkoutsDates;
    },
    previousWorkoutSections() {
      let previousWorkoutSections = {};
      const workout = this.user.workouts[this.currentWorkout];
      for (let key in workout) {
        if (Array.isArray(workout[key]) && workout[key].length > 0) {
          previousWorkoutSections[key] = workout[key];
        }
      }
      return this.user.workouts.length > 0 ? previousWorkoutSections : null;
    },
  },
  methods: {
    openSectionEdit(section) {
      this.currentSection = section;
    },
    closeSectionEdit() {
      this.currentSection = null;
      this.currentBlock = null;
    },
    copyUnit(unit) {
      if (this.currentBlock != null) {
        this.workout[this.currentSection][this.currentBlock].units.push(unit);
      } else {
        const newBlock = {
          __typename: "ComponentBlockCombo",
          name: "Blok", 
          units: [ 
            unit 
          ]
        }
        this.workout[this.currentSection].push(newBlock);
      }
    },
    copySection(section) {
      const sectionClone = JSON.parse(JSON.stringify(section));
      this.workout[this.currentSection].push(...sectionClone);
    },
    copyBlock(block) {
      const blockClone = JSON.parse(JSON.stringify(block));
      this.workout[this.currentSection].push(blockClone);
    },
    deleteUnit(block, index) {
      this.workout[this.currentSection][block].units.splice(index, 1);
      if (this.workout[this.currentSection][block].units.length == 0) this.workout[this.currentSection].splice(block, 1);
    },
    uploadWorkout() {
      let input;
      
      if (this.edit == true) {
        input = {
          where: {
            id: this.id,
          },
          data: {
            sticky: this.sticky,
            scheduled: this.dateAndTime,
            ready: this.workoutReady, 
            ...this.workout, 
            ...this.restIntervals, 
          }
        }
      } else {
        input = {
          data: {
            sticky: this.sticky,
            user: this.user.id,
            scheduled: this.dateAndTime,
            ready: this.workoutReady, 
            ...this.workout,
            ...this.restIntervals, 
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

  .workout-editor__rest {
    width: 20%;
  }

  .workout-editor__blocks {
    flex: 1;
  }

  .workout-editor__buttons button {
    width: 50%;
  }
</style>