<template>
  <article
    class="unit-editor tab p11"
    :style="{ backgroundImage }"
  >
    <h3 class="m00 mb05">
      Edytuj ćwiczenie
    </h3>
    <form>
      <BaseSelect placeholder="Kategoria" :value="chosenFamily">
        <select v-model="chosenFamily">
          <option v-for="(family, index) in familyNames" :key="index" :value="family">{{ family }}</option>
        </select>
      </BaseSelect>
      <BaseSelect placeholder="Ćwiczenie" :value="chosenExercise" v-if="chosenFamily">
        <select v-model="chosenExercise">
          <option v-for="exercise in filteredExercises" :key="exercise.id" :value="exercise">{{ exercise.name }}</option>
        </select>
      </BaseSelect>
      <div class="exercise__repetitions row j-between">
        <div
          v-for="(number, key) in unit.numbers"
          :key="key"
          class="p10 t-center"
        >
          <p>{{ key | shorten }}</p>
          <i
            class="flaticon-up-arrow small t-green"
            @click="
              key == 'distance'
                ? (unit.numbers[key] += 100)
                : unit.numbers[key]++
            "
          />
          <p class="m00">
            <input
              v-model="unit.numbers[key]"
              class="input--invisible t-center"
              type="number"
            />
          </p>
          <i
            class="flaticon-down-arrow small t-green"
            @click="
              key == 'distance'
                ? (unit.numbers[key] -= 100)
                : unit.numbers[key]--
            "
          />
        </div>
      </div>
      <BaseInput
        v-model="unit.remarks"
        placeholder="Uwagi do ćwiczenia"
        :show-status="false"
        show-clear-btn
      />
      <div class="unit-editor__buttons row j-between mt2">
        <button
          class="button-primary"
          type="button"
          :disabled="createUnitButtonDisabled"
          @click="createUnit"
        >
          Zapisz
        </button>
        <button class="button-primary" type="button" @click="$emit('cancel')">
          Anuluj
        </button>
      </div>
    </form>
  </article>
</template>

<script>
export default {
  props: {
    editedUnit: {
      type: Object, 
      required: true, 
    }, 
    families: {
      type: Array, 
      required: true, 
    }
  },
  data() {
    return {
      unit: this.editedUnit,
      createUnitButtonDisabled: false,
      chosenFamily: null,
      chosenExercise: null,
    }
  },
  computed: {
    backgroundImage() {
      return this.chosenExercise && this.chosenExercise.image
        ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${this.chosenExercise.image.url}')`
        : "none"
    },
    familyNames() {
      return this.families.map(family => family.name)
    },
    filteredExercises() {
      const chosenFamily = this.families.find(family => family.name == this.chosenFamily)
      return chosenFamily.exercises
    }
  },
  methods: {
    setFamilyAndExercise() {
      if (this.editedUnit.exercise.name) {
        const chosenFamily = this.families.find(family => family.name == this.editedUnit.exercise.family.name)
        this.chosenFamily = chosenFamily.name
        this.chosenExercise = chosenFamily.exercises.find(exercise => exercise.name == this.editedUnit.exercise.name)
      }
    },
    createUnit() {
      if (this.unit.exercise == "") {
        this.$store.commit(
          "main/setNotification",
          "Musisz wybrać ćwiczenie"
        )
        return 
      }
      
      for (let key in this.unit.numbers) {
        // inputs (even type number) always return string. We simply use + to convert string to number
        this.unit.numbers[key] = +this.unit.numbers[key]
      }

      const { sets, reps, time, distance } = this.unit.numbers
      if (sets == 0 || reps + time + distance == 0) {
        this.$store.commit(
          "main/setNotification",
          "Musisz określić liczbę serii oraz powtórzeń"
        )
        return
      }

      const newUnit = {
        ...this.unit.numbers,
        exercise: {
          ...this.chosenExercise
        },
        remarks: this.unit.remarks,
      }

      this.$emit("add-unit", newUnit)
    },
  },
  mounted() {
    this.setFamilyAndExercise()
  }
}
</script>

<style lang="scss" scoped>

.unit-editor {
  background-size: cover;
  background-position: center;
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
