<template>
  <div class="unit-editor">
    <div class="tab p11">
      <div class="row j-between t-green mb05">
        <h3 class="m00" v-if="editedUnit.name != ''">Edytuj ćwiczenie</h3>
        <h3 class="m00" v-else>Nowe ćwiczenie</h3>
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
          <div class="p10 t-center" v-for="(number, key) in unit.numbers" :key="key">
            <p>{{ key | shorten }}</p>
            <i class="flaticon-up-arrow small t-green" @click="key == 'distance' ? unit.numbers[key] += 100 : unit.numbers[key]++"></i>
            <p class="m00"><input class="input--invisible t-center" type="number" v-model="unit.numbers[key]"></p>
            <i class="flaticon-down-arrow small t-green" @click="key == 'distance' ? unit.numbers[key] -= 100 : unit.numbers[key]--"></i>
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
          <button class="button--primary ml05" type="button" @click="addUnit" :disabled="disableAddUnitButton">Zapisz</button>
          <button class="button--primary mr05" type="button" @click="$emit('cancel')">Anuluj</button>
        </div>
      </form>
    </div>
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
      filteredExercises() {
        let filteredExercises = [];
        const filter = this.unit.exercise.name.toLowerCase();
        if (filter !== '') {
          filteredExercises = this.exercises.filter(exercise => {
            const exerciseName = exercise.name.toLowerCase();
            return exerciseName.includes(filter) == true && this.unit.exercise.id == '';
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