<template>
  <article
    class="unit-editor tab p11"
    :style="{ backgroundImage }"
  >
    <h3 class="t-center">Edytuj ćwiczenie</h3>
    <nav class="navigation">
      <div 
        class="navigation-button"
        v-for="(step, index) in steps" 
        :key="index">
        <div 
          class="navigation-button__number"
          :class="{ 'navigation-button__number--active': index == currentStep }" 
          @click="currentStep = index">
          {{ index + 1 }}
        </div>
        <p class="navigation-button__caption mt05 mb05">{{ step }}</p>
      </div>
    </nav>
    <template v-if="currentStep == 0">
      <BaseSearch
        v-model="unit.exercise.name"
        class="mb0"
        placeholder="Szukaj ćwiczenia..."
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
            {{ exercise.name }}
          </li>
        </transition-group>
      </ul>
    </template>
    <section v-if="currentStep == 1" class="details">
      <div class="details__numbers">
        <div 
          v-for="(number, key) in unit.numbers"
          :key="key"
          class="details__number">
          <div class="column a-center">
            <p class="mb0">{{ key | shorten }}</p>
            <input
              v-model="unit.numbers[key]"
              class="fs-40 t-center"
              type="number"
              min="0"
            />
          </div>
          <div class="row">
            <button
              class="flaticon-minus"
              @click="
                key == 'distance'
                  ? (unit.numbers[key] -= 100)
                  : unit.numbers[key]--
              "
            />
            <button
              class="flaticon-plus"
              @click="
                key == 'distance'
                  ? (unit.numbers[key] += 100)
                  : unit.numbers[key]++
              "
            />
          </div>
        </div>
      </div>
      <BaseInput
        class="mb0"
        v-model="unit.remarks"
        placeholder="Uwagi do ćwiczenia"
        :value="unit.remarks"
        :show-status="false"
      />
    </section>
    <section class="buttons row j-between mt2">
      <button
        class="button-primary"
        type="button"
        :disabled="addUnitButtonDisabled"
        @click="addUnit"
      >
        Zapisz
      </button>
      <button class="button-primary" type="button" @click="$emit('cancel')">
        Anuluj
      </button>
    </section>
  </article>
</template>

<script>
import createExercise from "~/apollo/mutations/createExercise.gql"
import getAllExercises from "~/apollo/queries/getAllExercises.gql"

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
      client: this.$apollo.getClient(),
      unit: this.editedUnit,
      addUnitButtonDisabled: false,
      steps: [
        'Wybierz ćwiczenie', 
        'Określ powtórzenia',
      ],
      currentStep: 0, 
    }
  },
  computed: {
    route() {
      return this.$route
    },
    backgroundImage() {
      return this.unit.exercise.image
        ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${this.unit.exercise.image.url}')`
        : "none"
    },
    filteredExercises() {
      let filteredExercises = this.exercises
      const filter = this.unit.exercise.name.toLowerCase()
      if (filter !== "") {
        filteredExercises = this.exercises.filter((exercise) => {
          const exerciseName = exercise.name.toLowerCase()
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
    createExercise() {
      const input = {
        data: { name: this.unit.exercise.name, category: "Strength" },
      }
      return this.client.mutate({
        mutation: createExercise,
        variables: { input },
        update: (cache, { data: { createExercise } }) => {
          // read data from cache for this query
          const data = cache.readQuery({ query: getAllExercises })
          // push new item to cache
          data.exercises.unshift(createExercise.exercise)
          // write data back to the cache
          this.client.writeQuery({ query: getAllExercises, data: data })
        },
      })
    },
    createUnit() {
      for (let key in this.unit.numbers) {
        // inputs (even type number) always return string. We simply use + to convert string to number
        this.unit.numbers[key] = +this.unit.numbers[key]
      }

      const { sets, reps, time, distance } = this.unit.numbers
      if (sets == 0 || reps + time + distance == 0) {
        this.$store.commit(
          "main/setNotification",
          "Musisz określić liczbę serii i liczbę powtórzeń"
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
    async addUnit() {
      if (this.unit.exercise.id == "") {
        if (
          await this.$root.$confirm(
            `Wykonanie tej operacji doda ćwiczenie ${this.unit.exercise.name} do bazy. Kontynuować?`
          )
        ) {
          this.addUnitButtonDisabled = true
          this.createExercise().then((res) => {
            this.unit.exercise.id = res.data.createExercise.exercise.id
            this.createUnit()
          })
        }
      } else {
        this.createUnit()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.unit-editor {
  background-size: cover;
  background-position: center;
  height: 90vh;
  display: flex;
  flex-direction: column;
}

.navigation {
  display: flex;
  justify-content: space-around;
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
  transition: background-color 0.3s;
}

.navigation-button__number--active {
  color: color(secondary);
  background-color: color(headers);
}

.navigation-button__caption {
  font-size: 12px;
}

.exercise__list {
  transition: all 0.3s;
  flex-basis: 100%;
  flex-shrink: 1;
  overflow: scroll;

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
    padding: 3px 0;
  }
}

.details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.details__numbers {
  display: flex;
  flex-basis: 100%;
  flex-shrink: 1;
  flex-wrap: wrap;
  justify-content: center;
} 

.details__number {
  display: flex;
  flex-basis: 30%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  button {
    margin: 0 2px;
  }
}

.buttons {
  button {
    width: 49%;
  }
}
</style>
