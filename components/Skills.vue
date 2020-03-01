<template>
  <div class="skills">
  <!-- HEADER -->
    <Head v-if="editor">
      <div class="row j-between">
        <h3 class="m00">Umiejętności</h3>
        <i class="flaticon-vertical-dots" @click="showButtonsPanel = !showButtonsPanel"></i>
      </div>
      <transition name="accordion">
        <div class="skills__panel row mt05 t-small" v-if="showButtonsPanel">
          <template v-if="!editSkillset">
            <button :class="{ pb05: showButtonsPanel }" @click="createSkillset">Dodaj</button>
            <button :class="{ pb05: showButtonsPanel }" @click="openEditSkillset">Edytuj</button>
            <button :class="{ pb05: showButtonsPanel }" @click="deleteSkillset">Usuń</button>
          </template>
          <template v-else>
            <button :class="{ pb05: showButtonsPanel }" @click="closeEditSkillset('save')">Zapisz</button>
            <button :class="{ pb05: showButtonsPanel }" @click="closeEditSkillset('abort')">Wróć</button>
          </template>
        </div>
      </transition>
    </Head>
  <!-- SKILL CARDS  -->
    <transition name="fade" mode="out-in">
      <div v-if="unit == null" key="cards" keep-alive>
        <Carousel 
          :pagination="false" 
          :custom-length="skill.skillsets.length" 
          :active="!showButtonsPanel"
          :start-from-page="currentTranslate" 
          @change-page="currentTranslate = $event"
          v-if="skill.skillsets.length > 0">
          <div class="tab p11" v-for="(skillset, skillsetindex) in skill.skillsets" :key="skillsetindex">
            <div class="row j-between t-green">
              <h3 class="mt0" v-if="editSkillset">
                <input 
                  class="input--invisible t-green" 
                  type="text"
                  v-model="newSkillsetName"
                  spellcheck="false"
                  :ref="`input${skillsetindex}`">
              </h3>
              <h3 class="mt0" v-else>
                {{ skillset.name }}
              </h3>
              <i class="flaticon-plus" @click="openEditor(skillsetindex)" v-if="editSkillset"></i>  
            </div>
            <ul class="mb1" v-for="(unit, unitindex) in skillset.units" :key="unitindex">
              <div class="row j-between">
                <p class="m00">{{ unit.exercise.name }}</p>
                <div v-if=editSkillset>
                  <i class="flaticon-adjust small" @click="openEditor(skillsetindex, unit, unitindex)" v-if="editor"></i>
                  <i class="flaticon-plus skills__pick small" @click="copyUnit(unit)" v-else></i>
                </div>
              </div>
              <li><span v-if="unit.sets">{{ unit.sets }}</span><span v-if="unit.reps">x{{ unit.reps }}</span><span v-if="unit.time">x{{ unit.time }}s</span><span v-if="unit.distance">x{{ unit.distance }}m</span> <span v-if="unit.max">({{ unit.max }})</span></li>
              <li><span v-if="unit.remarks">{{ unit.remarks }}</span></li>
            </ul>
          </div>
        </Carousel>
        <p class="tab mb05" v-else>
          Na razie brak kart umiejętności
        </p>
      </div>
  <!-- SKILL EDITOR  -->
      <div class="tab p11" key="editor" v-else>
        <div class="row j-between t-green">
          <div>
            <h3 class="m00" v-if="unit.id">Edytuj ćwiczenie</h3>
            <h3 class="m00" v-else>Nowe ćwiczenie</h3>
            <h4 class="t-small mt0 t-white">{{ skill.skillsets[currentSkillset].name }}</h4>
          </div>
          <i class="flaticon-close" @click="deleteUnit" v-if="unit.index != undefined"></i>
        </div>
        <form>
          <div>
            <input 
              class="mb0" 
              :class="{ rounded: filteredExercises.length > 0 }" 
              type="text" 
              spellcheck="false"
              placeholder="Nazwa ćwiczenia"
              @keydown="unit.exercise.id = ''"
              v-model="unit.exercise.name">
            <ul class="exercise__list">
              <li v-for="exercise in filteredExercises" :key="exercise.id" @click="passExercise(exercise)">{{ exercise.name }}</li>
            </ul>
          </div>
          <div class="exercise__repetitions row j-between">
            <div class="p10" v-for="(number, key) in unit.numbers" :key="key">
              <p>{{ key | shorten }}</p>
              <p @click="key == 'distance' ? unit.numbers[key] += 100 : unit.numbers[key]++"><i class="flaticon-up-arrow small t-green"></i></p>
              <p>{{ number }}</p>
              <p @click="key == 'distance' ? unit.numbers[key] -= 100 : unit.numbers[key]--"><i class="flaticon-down-arrow small t-green"></i></p>
            </div>
          </div>
          <div>
            <textarea
              class="mb0"
              type="text" 
              spellcheck="false"
              placeholder="Uwagi"
              v-model="unit.remarks"></textarea>
          </div>
          <div class="row j-between mt15">
            <button class="button--primary ml05" type="button" @click.once="addUnit">Zapisz</button>
            <button class="button--primary mr05" type="button" @click="unit = null">Anuluj</button>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
  import exercisesQuery from '~/apollo/queries/users/_name/exercises.gql';
  import updateSkill from '~/apollo/mutations/updateSkill.gql';

  export default {
    props: {
      skillData: {
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
        initialSkillLength: this.skillData.skillsets.length,
        skill: this.skillData,
        skillBeforeEdit: null, 
        unit: null, 
        currentSkillset: null, 
        currentTranslate: 0,
        showButtonsPanel: false,
        editSkillset: false,
        exercises: null,
        newSkillsetName: null,
      }
    }, 
    computed: {
      filteredSkillsets() {
        let skillsetsClone = JSON.parse(JSON.stringify(this.skill.skillsets));
        skillsetsClone.forEach((skillset, skillindex) => {
          skillsetsClone[skillindex] = _.omit(skillset, '__typename');
          skillset.units.forEach((unit, unitindex) => {
            skillsetsClone[skillindex].units[unitindex] = _.omit(unit, '__typename');
            skillsetsClone[skillindex].units[unitindex].exercise = unit.exercise.id;
          });
        });

        return skillsetsClone;
      },  
      filteredExercises() {
        let filteredExercises = [];
        const filter = this.unit.exercise.name.toLowerCase();
        if (filter !== '') {
          filteredExercises = this.exercises.filter(exercise => {
            const exerciseName = exercise.name.toLowerCase();
            return exerciseName.includes(filter) == true && this.unit.exercise.id == '';
          });
        }
        return filteredExercises;
      },
    }, 
    methods: {
      createSkillset() {
        const newSkillset = {
          name: 'Nowa karta', 
          units: [],
        }
        this.skill.skillsets.push(newSkillset);
        this.editSkillset = true;
        this.newSkillsetName = 'Nowa karta';
        this.currentSkillset = this.skill.skillsets.length - 1;
        this.currentTranslate = this.skill.skillsets.length - 1;
        setTimeout(() => {
          let input = `input${this.skill.skillsets.length - 1}`;
          this.$refs[input][0].focus();
        }, 700);
      },
      openEditSkillset() {
        this.editSkillset = true;
        this.skillBeforeEdit = JSON.parse(JSON.stringify(this.skill.skillsets[this.currentTranslate]));
        setTimeout(() => {
          let input = `input${this.currentTranslate}`;
          this.$refs[input][0].focus();
        }, 700);
        this.newSkillsetName = this.skill.skillsets[this.currentTranslate].name;
      },
      closeEditSkillset(mode) {
        this.showButtonsPanel = false;
        if (mode == 'save') {
          let input = `input${this.currentTranslate}`
          this.skill.skillsets[this.currentTranslate].name = this.newSkillsetName;
          this.editSkillset = false;
          this.uploadSkill();
        } else {
          this.editSkillset = false;
          if (this.skill.skillsets.length == this.initialSkillLength) {
            this.skill.skillsets[this.currentTranslate] = this.skillBeforeEdit;
          } else {
            this.skill.skillsets.splice(this.currentTranslate, 1);
            this.currentTranslate = 0;
          }
        }
        this.skillBeforeEdit = null;
      },
      deleteSkillset(skillsetindex) {
        if (confirm("Czy na pewno chcesz usunąć ten element?")) {
          this.skill.skillsets.splice(this.currentTranslate, 1);
          this.currentTranslate = 0;
          this.showButtonsPanel = false;
          this.uploadSkill();
        }
      },
      openEditor(currentSkillset, unit, unitindex) {
        this.currentSkillset = currentSkillset;
        if (!this.exercises) {
          this.client.query({ query: exercisesQuery })
            .then(({ data }) => {
              this.exercises = data.exercises;
              this.populateEditor(unit, unitindex);
            });
        } else {
          this.populateEditor(unit, unitindex);
        }
      },
      populateEditor(unit, unitindex) {
        if (unit != undefined) {
          this.unit = {
            index: unitindex,
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
          this.unit = {
            exercise: {
              name: '',
              id: '',
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
      passExercise(exercise) {
        this.unit.exercise = exercise;
      },
      addUnit() {
        const newUnit = {
          ...this.unit.numbers,
          exercise: this.unit.exercise,
          remarks: this.unit.remarks
        }

        if (this.unit.index != undefined) {
          this.skill.skillsets[this.currentSkillset].units.splice(this.unit.index, 1, newUnit);
        } else {
          this.skill.skillsets[this.currentSkillset].units.push(newUnit);
        }
        this.unit = null;
      }, 
      uploadSkill() {
        const input = {
          where: {
            id: this.skill.id,
          },
          data: {
            skillsets: this.filteredSkillsets,
          }
        }

        this.client.mutate({ mutation: updateSkill, variables: { input: input }  });
      },
      deleteUnit() {
        this.skill.skillsets[this.currentSkillset].units.splice(this.unit.index, 1);
        this.unit = null;
      }, 
      copyUnit(unit) {
        let unitClone = JSON.parse(JSON.stringify(unit));
        unitClone = _.omit(unitClone, ['__typename', 'id']);
        this.$emit('copy-unit', unitClone);
      }
    }
  }
</script>

<style lang="scss" scoped>

  .skills__panel {
    border-top: 1px solid color(gray);

    button {
      padding: 1rem;
      flex-basis: 50%;
      font-size: inherit;
    }
  }

  .exercise__list {
    max-height: 15vh;
    overflow-y: scroll;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-color: color(inputgray);
    
    li {
      border: none;
      padding-left: 0.5rem;
    }
  }

  .exercise__repetitions {
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