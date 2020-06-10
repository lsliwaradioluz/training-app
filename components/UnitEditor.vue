<template>
  <article
    class="unit-editor tab p11"
    :style="{ backgroundImage }"
  >
    <div class="row j-between mb05">
      <h3 v-if="editedUnit.exercise.name != ''" class="m00">
        Edytuj ćwiczenie
      </h3>
      <h3 v-else class="m00">
        Dodaj ćwiczenie
      </h3>
    </div>
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
      <div>
        <BaseInput
          v-model="unit.remarks"
          placeholder="Uwagi do ćwiczenia"
          :value="unit.remarks"
          :show-status="false"
        />
      </div>
      <div class="unit-editor__buttons row j-between mt2">
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
      </div>
    </form>
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
        'Dodaj uwagi',
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
