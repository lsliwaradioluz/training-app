<template>
  <article
    class="unit-editor tab p11"
    :style="{ backgroundImage }"
  >
    <h3 class="m00">
      Edytuj ćwiczenie
    </h3>
    <form>
      <div>
        <BaseSearch
          v-model="unit.exercise.name"
          class="mb0"
          placeholder="Szukaj ćwiczenia..."
          :show-status="false"
          :icon="false"
          @input="unit.exercise = { name: $event, id: '' }"
        />
        <ul class="exercise__list pt05">
          <transition-group name="animate-list">
            <li
              v-for="exercise in filteredExercises"
              :key="exercise.id"
              class="fs-15"
              @click="passExercise(exercise)"
            >
              <p class="m00">{{ exercise.name }}</p>
              <p class="t-faded m00 fs-11" v-if="exercise.alias">{{ exercise.alias }}</p>
              <p class="t-faded m00 fs-11" v-else>Brak alternatywnej nazwy</p>
            </li>
          </transition-group>
        </ul>
      </div>
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
    exercises: {
      type: Array, 
      required: true, 
    }
  },
  data() {
    return {
      unit: this.editedUnit,
      createUnitButtonDisabled: false,
    }
  },
  computed: {
    backgroundImage() {
      return this.unit.exercise.image
        ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${this.unit.exercise.image.url}')`
        : "none"
    },
    filteredExercises() {
      let filteredExercises = []
      const filter = this.unit.exercise.name.toLowerCase()
      if (filter !== "") {
        filteredExercises = this.exercises.filter((exercise) => {
          const alias = exercise.alias ? exercise.alias : ""
          const exerciseName = exercise.name.toLowerCase() + alias.toLowerCase()
          const conditions =
            (exerciseName.includes(filter) && this.unit.exercise.id == "") ||
            (filter.includes(exerciseName) && this.unit.exercise.id == "")
          return conditions
        })
      }
      return filteredExercises
    },
  },
  methods: {
    passExercise(exercise) {
      this.unit.exercise = { ...exercise }
    },
    createUnit() {
      if (this.unit.exercise.id == "") {
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
        exercise: this.unit.exercise,
        remarks: this.unit.remarks,
      }

      this.$emit("add-unit", newUnit)
    },
  },
}
</script>

<style lang="scss" scoped>
.unit-editor {
  background-size: cover;
  background-position: center;
}

.navigation {
  display: flex;
  justify-content: space-between;
}

.navigation-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-basis: 25%;
  text-align: center;
}

.navigation-button__number {
  height: 35px;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.5px solid color(headers);
  color: color(headers);
  font-weight: 600;
}

.navigation-button__number--active {
  color: color(secondary);
  background-color: color(headers);
}

.navigation-button__caption {
  font-size: 12px;
}

.exercise__list {
  max-height: 30vh;
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
    padding: 4px 0;
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
