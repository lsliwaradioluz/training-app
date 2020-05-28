<template>
  <div class="exercise-tab column pt05 pb05">
    <div class="row j-between">
      <button class="link pr1 row" @click="navigate">
        <div>
          <h4 class="m00">
            {{ exercise.name | shortenExercise }}
          </h4>
          <p v-if="exercise.alias" class="description t-medium t-faded m00">
            {{ exercise.alias | shortenAlias }}
          </p>
          <p v-else class="description t-medium t-faded m00">
            Brak alternatywnej nazwy
          </p>
        </div>
      </button>
      <div class="row a-center">
        <ContextMenu v-if="user.admin">
          <template v-slot:trigger>
            <i class="flaticon-vertical-dots t-headers mr0" />
          </template>
          <template v-slot:options>
            <nuxt-link
              class="flaticon-pencil mr05"
              tag="button"
              type="button"
              :to="`${exercise.id}/edit`"
              append
            >
              Edytuj
            </nuxt-link>
            <button
              class="flaticon-trash fs-09 mr05"
              type="button"
              @click="deleteExercise"
            >
              Usuń
            </button>
          </template>
        </ContextMenu>
        <span
          v-else
          class="flaticon-right-arrow t-faded"
          :class="{ 't-headers': exercise.image }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import deleteExercise from "~/apollo/mutations/deleteExercise.gql"
import getAllExercises from "~/apollo/queries/getAllExercises.gql"

export default {
  props: {
    exercise: {
      type: Object, 
      required: true, 
    }
  },
  data() {
    return {
      client: this.$apollo.getClient(),
    }
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"]
    },
  },
  methods: {
    async deleteExercise() {
      if (await this.$root.$confirm("Na pewno chcesz usunąć to ćwiczenie?")) {
        const input = {
          where: {
            id: this.exercise.id,
          },
        }

        this.client.mutate({
          mutation: deleteExercise,
          variables: {
            input: input,
          },
          update: (cache, { data: { deleteExercise } }) => {
            // read data from cache for this query
            const data = cache.readQuery({ query: getAllExercises })
            // find index of deleted item in cached user.workouts array
            const exerciseIndex = data.exercises.findIndex(
              (exercise) => exercise.id == deleteExercise.exercise.id
            )
            // remove deleted item from cache
            data.exercises.splice(exerciseIndex, 1)
            // write data back to the cache
            cache.writeQuery({ query: getAllExercises, data: data })
          },
        })
      }
    },
    navigate() {
      if (this.exercise.image) {
        this.$router.push(`/exercises/${this.exercise.id}`)
      } else {
        this.$store.commit(
          "main/setNotification",
          "To ćwiczenie nie ma jeszcze zdjęcia."
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
h4 {
  color: white;
}

.link {
  flex-basis: 100%;
  text-align: left;
}
</style>
