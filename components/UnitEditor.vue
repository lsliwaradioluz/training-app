<template>
  <div class="unit-editor">
    <div class="tab p11">
      <div class="row j-between t-green mb05">
        <h3 class="m00" v-if="editedUnit">Edytuj ćwiczenie</h3>
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
          <button class="button--primary mr05" type="button" @click="$emit('cancel')">Anuluj</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['editedUnit', 'exercises'],
    data() {
      return {
        unit: null
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
        }
        return filteredExercises;
      },
    },
    methods: {
      populateEditor() {
        if (this.editedUnit) {
          this.unit = {
            index: this.editedUnit.index,
            complexindex: this.editedUnit.complexindex,
            exercise: this.editedUnit.exercise,
            numbers: {
              sets: this.editedUnit.sets || 0, 
              reps: this.editedUnit.reps || 0, 
              time: this.editedUnit.time || 0,
              distance: this.editedUnit.distance || 0, 
              max: this.editedUnit.max || 0
            },
            remarks: this.editedUnit.remarks || ''
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

        this.$emit('add-unit', newUnit);
      }, 
    }, 
    created() {
      this.populateEditor();
    } 
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