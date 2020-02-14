<template>
  <div class="workouteditor main">
  <!-- DATA I GODZINA  -->
    <Head class="pt05 pb05">Data i godzina</Head>
    <div class="row mb05">
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
        <div class="workouteditor__blocks tab p11">
          <p class="m00" v-if="section.length == 0">Na razie brak ćwiczeń</p>
          <div v-for="(block, blockindex) in section" :key="block.id" :class="{ 'inactive': currentBlock != null && currentBlock != blockindex }">
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
                  <i class="flaticon-close small" @click="deleteExercise(blockindex, unitindex)" v-if="currentSection"></i>
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
    <div v-if="currentSection">
      <div class="pl1 pr1 column a-center t-green t-small mb05" v-if="!edit">
        <button type="button" class="t-gray t-small" @click="showSkillset = !showSkillset">
          Dotknij tutaj, by zmienić okno
          <span v-if="!showSkillset">(Ostatni trening)</span>
          <span v-else>(Umiejętności)</span>
        </button>
      </div>
      <p class="t-gray t-small t-center mb05" v-if="edit">Wybierz ćwiczenia z panelu umiejętności</p>
      <transition name="fade" mode="out-in">
        <Skills v-if="showSkillset" :skillset="user.skill" @pick-exercise="buildBlock($event)" />
        <Carousel v-else :pagination="false">
          <Routine 
            v-for="(section, key) in sections" 
            :key="key" 
            :section="section" 
            :section-name="key"
            @copy-section="pushSection($event)" />
        </Carousel>
      </transition>
    </div>
  <!-- ODPOCZYNEK  -->
    <Head class="pt05 pb05 b-black">Odpoczynek</Head>
    <div class="tab p11">
      <div class="row j-between">
        <div class="workouteditor__rest column a-center j-center" v-for="(restInterval, key) in restIntervals" :key="key">
          <p>{{ key | englishToPolish }}</p>
          <p @click="restIntervals[key] += 5"><i class="flaticon-up-arrow"></i></p>
          <p>{{ restInterval }}s</p>
          <p class="mb0" @click="restIntervals[key] -= 5"><i class="flaticon-down-arrow"></i></p>
        </div>
      </div>
    </div>
  <!-- BUTTONY ZAPISZ ODRZUĆ -->
    <div class="row j-between mt1">
      <button class="button--primary button--square" type="button" @click="uploadWorkout">Zapisz</button>
      <button @click="$router.go(-1)" class="button--primary button--square" type="button">Wróć</button>
    </div>
  </div>
</template>

<script>
import Skills from '~/components/Skills.vue';
import createWorkout from '~/apollo/mutations/createWorkout.gql';
import updateWorkout from '~/apollo/mutations/updateWorkout.gql';
import Routine from '~/components/Routine';

export default {
  components: {
    Skills,
    Routine
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
      ...this.specificData, 
      showSkillset: true
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
    sections() {
      let sections = {};
      const workouts = this.user.workouts[0];
      for (let key in workouts) {
        if (Array.isArray(workouts[key]) && workouts[key].length > 0) {
          sections[key] = workouts[key];
        }
      }
      return sections;
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
    buildBlock(unit) {
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
    pushSection(section) {
      this.workout[this.currentSection].push(...section);
    },
    deleteExercise(block, index) {
      this.workout[this.currentSection][block].units.splice(index, 1);
      if (this.workout[this.currentSection][block].units.length == 0) this.workout[this.currentSection].splice(block, 1);
    },
    uploadWorkout() {
      let input;
      const client = this.$apollo.getClient();
      
      if (this.edit == true) {
        input = {
          where: {
            id: this.id,
          },
          data: {
            scheduled: this.dateAndTime,
            ready: this.workoutReady, 
            ...this.workout, 
            ...this.restIntervals, 
          }
        }
      } else {
        input = {
          data: {
            user: this.user.id,
            scheduled: this.dateAndTime,
            ready: this.workoutReady, 
            ...this.workout,
            ...this.restIntervals, 
          }
        }
      }

      client.mutate({ mutation: this.edit ? updateWorkout : createWorkout, variables: { input: input }  })
        .then(res => {
          this.$router.go(-1);
        })  
        
    }
  }
}
</script>

<style lang="scss" scoped>

  .workouteditor__rest {
    width: 20%;
  }

  .workouteditor__blocks {
    flex: 1;
  }
</style>