<template>
  <article class="unit-editor tab">
    <Video
      v-if="chosenExercise"
      :key="chosenExercise ? chosenExercise.id : 0"
      :source="video"
    />
    <h3 class="unit-editor__header">
      Edytuj ćwiczenie
    </h3>
    <form @submit.prevent>
      <BaseSelect placeholder="Kategoria" :value="chosenFamily">
        <select v-model="chosenFamily">
          <option
            v-for="(family, index) in familyNames"
            :key="index"
            :value="family"
            >{{ family }}</option
          >
        </select>
      </BaseSelect>
      <BaseSelect
        placeholder="Ćwiczenie"
        :value="chosenExercise"
        v-if="chosenFamily"
      >
        <select v-model="chosenExercise">
          <option
            v-for="exercise in filteredExercises"
            :key="exercise.id"
            :value="exercise"
            >{{ exercise.name }}</option
          >
        </select>
      </BaseSelect>
      <BaseInput
        v-model="unit.remarks"
        placeholder="Uwagi do ćwiczenia"
        :show-status="false"
        show-clear-btn
      />
      <section class="exercise__numbers">
        <div
          v-for="(number, key) in unit.numbers"
          :key="key"
          class="exercise__number"
        >
          <p class="exercise__number__caption">{{ key | getPolishKey }}</p>
          <div class="exercise__number__body">
            <button
              class="exercise__number__button flaticon-minus"
              type="button"
              @click="decreaseNumber(key)"
            />
            <input
              v-model="unit.numbers[key]"
              class="exercise__number__value"
              min="0"
              max="9999"
            />
            <button
              class="exercise__number__button flaticon-plus"
              type="button"
              @click="increaseNumber(key)"
            />
          </div>
        </div>
      </section>
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
    },
  },
  data() {
    return {
      unit: this.editedUnit,
      createUnitButtonDisabled: false,
      chosenFamily: null,
      chosenExercise: null,
    };
  },
  computed: {
    video() {
      if (this.chosenExercise && this.chosenExercise.image) {
        const link = this.chosenExercise.image.url.replace(".gif", ".mp4");
        return link;
      } else {
        return "";
      }
    },
    familyNames() {
      return this.families.map((family) => family.name);
    },
    filteredExercises() {
      const chosenFamily = this.families.find(
        (family) => family.name == this.chosenFamily
      );
      return chosenFamily.exercises;
    },
  },
  methods: {
    setFamilyAndExercise() {
      if (this.editedUnit.exercise.name) {
        const chosenFamily = this.families.find(
          (family) => family.name == this.editedUnit.exercise.family.name
        );
        this.chosenFamily = chosenFamily.name;
        this.chosenExercise = chosenFamily.exercises.find(
          (exercise) => exercise.name == this.editedUnit.exercise.name
        );
      }
    },
    increaseNumber(key) {
      if (key == "distance") {
        this.unit.numbers[key] += 100
      } else {
        this.unit.numbers[key]++
      }
    },
    decreaseNumber(key) {
      let number = this.unit.numbers[key]
      if (number == 0) {
        return
      }

      if (key == "distance") {
        this.unit.numbers[key] -= 100
      } else {
        this.unit.numbers[key]--
      }
    },
    createUnit() {
      if (this.unit.exercise == "") {
        this.$store.commit("main/setNotification", "Musisz wybrać ćwiczenie");
        return;
      }

      for (let key in this.unit.numbers) {
        // inputs (even type number) always return string. We simply use + to convert string to number
        this.unit.numbers[key] = +this.unit.numbers[key];
      }

      const { sets, reps, time, distance } = this.unit.numbers;
      if (sets == 0 || reps + time + distance == 0) {
        this.$store.commit(
          "main/setNotification",
          "Musisz określić liczbę serii oraz powtórzeń"
        );
        return;
      }

      const newUnit = {
        ...this.unit.numbers,
        exercise: {
          ...this.chosenExercise,
        },
        remarks: this.unit.remarks,
      };

      this.$emit("add-unit", newUnit);
    },
  },
  mounted() {
    this.setFamilyAndExercise();
  },
};
</script>

<style lang="scss" scoped>
.unit-editor {
  position: relative;
  overflow: hidden;
}

.unit-editor__header {
  margin: 0 0 0.5rem 0;
  position: relative;
}

.exercise__numbers {
  position: relative;
  display: flex;
  overflow: scroll;
  padding: 1rem 0;
  &::-webkit-scrollbar {
   display: none;
  }
}

.exercise__number {
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
}

.exercise__number__caption {
  font-size: 12px;
  color: color(faded);
  margin-bottom: 2px;
}

.exercise__number__body {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid color(faded);
  border-bottom: 1px solid color(faded);
}

.exercise__number__button {
  padding: .5rem;
  border-right: 1px solid color(faded);
  border-left: 1px solid color(faded);
  color: color(faded);
}

.exercise__number__value {
  font-size: 20px;
  width: 60px;
  display: flex;
  align-items: center;
  text-align: center;
}

.unit-editor__buttons button {
  width: 49%;
}
</style>
