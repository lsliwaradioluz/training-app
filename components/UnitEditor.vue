<template>
  <div 
    class="unit-editor tab p11" 
    :style="{ backgroundImage: backgroundImage }">
    <div class="row j-between t-green mb05">
      <h3 class="m00" v-if="editedUnit.exercise.name != ''">Edytuj ćwiczenie</h3>
      <h3 class="m00" v-else>Nowe ćwiczenie</h3>
    </div>
    <form>
      <div>
        <CustomInput 
          placeholder="Nazwa ćwiczenia"
          v-model="unit.exercise.name"
          @input="unit.exercise.id = ''" 
          :show-status="false"/>
        <ul class="exercise__list">
          <transition-group name="animate-list">
            <li v-for="exercise in filteredExercises" :key="exercise.id" @click="passExercise(exercise)">{{ exercise.name }}</li>
          </transition-group>
        </ul>
      </div>
      <div class="exercise__repetitions row j-between">
        <div class="p10 t-center" v-for="(number, key) in unit.numbers" :key="key">
          <p>{{ key | shorten }}</p>
          <i class="flaticon-up-arrow small t-green" @click="key == 'distance' ? unit.numbers[key] += 100 : unit.numbers[key]++"></i>
          <p class="m00"><input class="input--invisible t-center" type="number" v-model="unit.numbers[key]"></p>
          <i class="flaticon-down-arrow small t-green" @click="key == 'distance' ? unit.numbers[key] -= 100 : unit.numbers[key]--"></i>
        </div>
      </div>
      <div>
        <CustomTextarea
          placeholder="Uwagi do ćwiczenia" 
          :value="unit.remarks"
          @type="unit.remarks = $event" />
      </div>
      <div class="unit-editor__buttons row j-between mt2">
        <button class="button-primary" type="button" @click="addUnit" :disabled="disableAddUnitButton">Zapisz</button>
        <button class="button-primary" type="button" @click="$emit('cancel')">Anuluj</button>
      </div>
    </form>
  </div>
</template>

<script>
  import createExercise from '~/apollo/mutations/createExercise.gql';

  export default {
    props: ['editedUnit', 'exercises'],
    data() {
      return {
        client: this.$apollo.getClient(),
        unit: this.editedUnit,
        disableAddUnitButton: false,
      }
    }, 
    computed: {
      backgroundImage() {
        return this.unit.exercise.image ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${this.unit.exercise.image.url}')` : 'none'
      },
      filteredExercises() {
        let filteredExercises = [];
        const filter = this.unit.exercise.name.toLowerCase();
        if (filter !== '') {
          filteredExercises = this.exercises.filter(exercise => {
            const exerciseName = exercise.name.toLowerCase();
            const conditions = 
              exerciseName.includes(filter) && this.unit.exercise.id == ''
              || filter.includes(exerciseName) && this.unit.exercise.id == '';
            return conditions;
          });
        } else {
          filteredExercises = [];
        }
        return filteredExercises;
      },
    },
    methods: {
      passExercise(exercise) {
        this.unit.exercise = {...exercise};
      },
      createExercise() {
        const input = {
          data: {
            name: this.unit.exercise.name
          }
        }
        return this.client.mutate({ mutation: createExercise, variables: { input: input } });
      }, 
      createUnit() {
        for (let key in this.unit.numbers) {
          // inputs (even type number) always return string. We simply use + to convert string to number 
          this.unit.numbers[key] = +this.unit.numbers[key];
        }

        const newUnit = {
          ...this.unit.numbers,
          exercise: this.unit.exercise,
          remarks: this.unit.remarks
        }

        this.$emit('add-unit', newUnit);
      },
      async addUnit() {
        if (this.unit.exercise.id == '') {
          if (await this.$root.$confirm(`Wykonanie tej operacji doda ćwiczenie ${this.unit.exercise.name} do bazy. Kontynuować?`)) {
            this.disableAddUnitButton = true;
            this.createExercise()
              .then(res => {
                this.unit.exercise.id = res.data.createExercise.exercise.id;
                this.createUnit();
              });
          }
        } else {
          this.createUnit();
        }
      } 
    },
  }
</script>

<style lang="scss" scoped>

  .unit-editor {
    background-size: cover;
    background-position: center;
  }

  .exercise__list {
    max-height: 15vh;
    overflow-y: scroll;
    transition: all 0.3s;

    &::-webkit-scrollbar-thumb {
      background-color: white;
      width: 1px;
    }

    &::-webkit-scrollbar-track {
      background-color: white;
      width: 1px;
    }
    
    li {
      border: none;
      padding-left: 0;
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

  .unit-editor__buttons button {
    width: 49%;
  }
</style>