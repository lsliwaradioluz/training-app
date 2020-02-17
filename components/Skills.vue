<template>
  <div class="skills">
    <Head v-if="editor">
      <div class="row j-between">
        <h3 class="m00">Umiejętności</h3>
        <i class="flaticon-plus" @click="createSkill"></i>
      </div>
    </Head>
  <!-- SKILL CARDS  --> 
    <transition name="flip" mode="out-in">
      <Carousel 
        v-if="editorData == null"
        :pagination="false"
        :startFromPage="currentSkill"
        @changePage="currentSkill = $event">
        <div class="tab p11" v-for="(skill, key) in sortedSkills" :key="skill.id">
          <!-- nagłówek  -->
          <div class="row j-between">
            <h3 class="mt0 mb1 t-green">{{ key }}</h3>
          </div>
          <!-- ćwiczenia  -->
          <ul class="mb05" v-for="unit in skill" :key="unit.id">
            <p class="mb0 row j-between">
              <span>{{ unit.exercise.name }}</span>
              <i class="flaticon-adjust small" @click="editSkill(unit)" v-if="editor"></i>
              <i class="flaticon-plus skills__pick small" @click="$emit('copy-unit', unit )" v-else></i>
            </p>
            <li>
              <span v-if="unit.sets">{{ unit.sets }}</span><span v-if="unit.reps">x{{ unit.reps }}</span><span v-if="unit.time">x{{ unit.time }}s</span><span v-if="unit.distance">{{ unit.distance }}m</span>
            </li>
            <li>
              <span v-if="unit.max && exercises">max: {{ unit.max }}</span>
            </li>
            <li>
              <span v-if="unit.remarks">{{ unit.remarks }}</span>
            </li>
          </ul>
        </div>
      </Carousel>
  <!-- SKILL EDITOR  -->
      <div class="tab p11" v-else>
        <div class="row j-between t-green">
          <h3 class="mt0 mb1" v-if="editorData.index >= 0">Edytuj ćwiczenie</h3>
          <h3 class="mt0 mb1" v-else>Nowe ćwiczenie</h3>
          <i class="flaticon-close" @click="deleteSkill" v-if="editorData.id != undefined"></i>
        </div>
        <form>
          <!-- exercise name  -->
          <div>
            <input 
              class="mb0" 
              :class="{ rounded: filteredExercises.length > 0 }" 
              @keydown="editorData.exercise._id = ''"
              type="text" 
              spellcheck="false"
              autofocus
              placeholder="Nazwa ćwiczenia"
              v-model="editorData.filter">
            <ul class="trainee__list">
              <li v-for="exercise in filteredExercises" :key="exercise.id" @click="passExercise(exercise)">{{ exercise.name }}</li>
            </ul>
          </div>
          <!-- repetitions -->
          <div class="trainee__repetitions row j-between">
            <div class="p10" v-for="(number, key) in editorData.numbers" :key="key">
              <p>{{ key | shorten }}</p>
              <p @click="key == 'distance' ? editorData.numbers[key] += 100 : editorData.numbers[key]++"><i class="flaticon-up-arrow small t-green"></i></p>
              <p>{{ number }}</p>
              <p @click="key == 'distance' ? editorData.numbers[key] -= 100 : editorData.numbers[key]--"><i class="flaticon-down-arrow small t-green"></i></p>
            </div>
          </div>
          <!-- remarks -->
          <div>
            <textarea
              class="mb0"
              type="text" 
              spellcheck="false"
              placeholder="Uwagi"
              v-model="editorData.remarks"></textarea>
          </div>
          <div class="row j-between mt15">
            <button class="button--primary ml05" type="button" @click="saveSkill">Zapisz</button>
            <button class="button--primary mr05" type="button" @click="editorData = null">Anuluj</button>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
  import exercisesQuery from '~/apollo/queries/trainees/_username/exercises.gql';
  import updateSkill from '~/apollo/mutations/updateSkill.gql';

  export default {
    props: {
      skillset: {
        type: Object, 
      }, 
      editor: {
        type: Boolean, 
        default: () => false
      }
    },
    data() {
      return {
        client: this.$apollo.getClient(),
        editorData: null, 
        currentSkill: 0, 
        exercises: null,
        skills: this.skillset.units
      }
    }, 
    computed: {
      sortedSkills() {
        const sortedSkills = {
          handstand: [], 
          push: [], 
          pull: [],
          legs: [], 
          core: [],
          cardio: [], 
          mobility: []
        }

        for (let key in sortedSkills) {
          const matchingExercises = this.skills.filter(skill => {
            return skill.exercise.subcategory.category.name.toLowerCase() == key.toLowerCase();
          });
          sortedSkills[key].push(...matchingExercises);
        }
        
        return sortedSkills;
      },
      filteredExercises() {
        let filteredExercises = [];
        const filter = this.editorData.filter.toLowerCase();
        if (filter !== '') {
          filteredExercises = this.exercises.filter(exercise => {
            const exerciseName = exercise.name.toLowerCase();
            return exerciseName.includes(filter.toLowerCase()) == true && this.editorData.exercise._id == '';
          });
        }
        return filteredExercises;
      },
    }, 
    methods: {
      passExercise(exercise) {
        this.editorData.filter = exercise.name;
        this.editorData.exercise = exercise;
      },
      populateEditor(unit) {
        if (unit != undefined) {
          this.editorData = {
            id: unit.id,
            filter: unit.exercise.name || '',
            exercise: unit.exercise,
            numbers: {
              sets: unit.sets || 0, 
              reps: unit.reps || 0, 
              time: unit.time || 0,
              distance: unit.distance || 0, 
              max: unit.max || 0
            },
            remarks: unit.remarks || ''
          }
        } else {
          this.editorData = {
            filter: '',
            exercise: {
              _id: '',
              name: ''
            }, 
            numbers: {
              sets: 0, 
              reps: 0, 
              time: 0,
              distance: 0, 
              max: 0
            },
            remarks: ''
          }
        }
      },
      createSkill() {
        if (!this.exercises) {
          this.client.query({ query: exercisesQuery })
            .then(({ data }) => {
              this.exercises = data.exercises;
              this.populateEditor();
            });
        } else {
          this.populateEditor();
        }
      },
      editSkill(unit) {
        if (!this.exercises) {
          this.client.query({ query: exercisesQuery })
            .then(({ data }) => {
              this.exercises = data.exercises;
              this.populateEditor(unit);
            });
        } else {
          this.populateEditor(unit);
        }
      },
      saveSkill() {
        const skillToSave = {
          __typename: "ComponentBlockUnit",
          ...this.editorData.numbers,
          exercise: this.editorData.exercise,
          remarks: this.editorData.remarks
        }

        if (this.editorData.id != undefined) {
          const index = this.skills.findIndex(skill => {
            return skill.id == this.editorData.id;
          });
          this.skills.splice(index, 1, skillToSave);
        } else {
          this.skills.push(skillToSave);
        }
        
        this.uploadExercise();
      }, 
      deleteSkill() {
        if (confirm("Czy na pewno chcesz usunąć ten element?")) {
          const index = this.skills.findIndex(skill => {
            return skill.id == this.editorData.id;
          });
          this.skills.splice(index, 1);
          this.uploadExercise();
        }
      }, 
      uploadExercise(exercise) {
        const input = {
          where: {
            id: this.skillset.id,
          },
          data: {
            units: this.skills
          }
        }

        this.client.mutate({ mutation: updateSkill, variables: { input: input }  })
          .then(res => {
            this.editorData = null;
          });
      },
    }
  }
</script>

<style lang="scss" scoped>

  .trainee__list {
    max-height: 10vh;
    overflow-y: scroll;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: color(inputgray);
    
    li {
      border: none;
      padding-left: 0.5rem;
    }
  }

  .trainee__repetitions {
    > div {
      width: 25%;
    }
    p {
      margin-bottom: 0;
      text-align: center;
    }
  }

  .rounded {
    border-radius: 0;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
</style>