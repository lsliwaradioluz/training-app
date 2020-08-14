<template>
  <div
    class="workout row j-between a-center"
    :class="{ sticky: workout.sticky }"
  >
    <!-- MAIN TAB -->
    <nuxt-link
      class="workout__link"
      tag="button"
      :to="workout.ready ? `/workouts/${this.workout.id}` : ``"
      @click.native="showNotification(workout.ready)"
    >
      <div v-if="!workout.sticky">
        <h4 class="m00">
          {{ workout.scheduled | reverseDate }}
        </h4>
        <p class="m00 t-medium t-faded">
          {{ workout.scheduled | getDayName }} {{ workout.scheduled | getTime }}
        </p>
      </div>
      <div v-else>
        <h4 v-if="workout.name" class="m00">
          {{ workout.name }}
        </h4>
        <h4 v-else class="m00">
          Podwieszony
        </h4>
        <p class="m00 t-medium t-faded">
          dodano {{ workout.createdAt | reverseDate }}
        </p>
      </div>
    </nuxt-link>
    <span
      v-if="!$route.path.includes('users')"
      class="flaticon-right-arrow t-faded"
      :class="{ 't-headers': workout.ready }"
    />
    <div v-else class="row a-center">
      <ContextMenu bottom>
        <template v-slot:trigger>
          <i class="flaticon-vertical-dots t-headers" />
        </template>
        <template v-slot:options>
          <nuxt-link
            class="flaticon-pencil mr05"
            tag="button"
            type="button"
            :to="{
              path: `/workouts/${workout.id}/edit`,
              query: { user: user.id },
            }"
          >
            Edytuj
          </nuxt-link>
          <nuxt-link
            v-if="workout.ready"
            class="flaticon-copy mr05"
            type="button"
            tag="button"
            to="/users"
            @click.native="copyWorkout"
          >
            Kopiuj
          </nuxt-link>
          <nuxt-link
            v-if="workout.ready"
            class="flaticon-double-arrow-cross-of-shuffle mr05"
            type="button"
            tag="button"
            to="/users"
            @click.native="pairWorkout"
          >
            Paruj
          </nuxt-link>
          <button
            class="flaticon-trash mr05"
            type="button"
            @click="deleteWorkout"
          >
            Usuń
          </button>
        </template>
      </ContextMenu>
    </div>
  </div>
</template>

<script>
import deleteWorkout from "~/apollo/mutations/deleteWorkout.gql"
import getSingleUser from "~/apollo/queries/getSingleUser.gql"

export default {
  props: {
    workout: {
      type: Object, 
      required: true,
    }, 
    user: {
      type: Object, 
      required: true, 
    }
  },
  data() {
    return {
      client: this.$apollo.getClient(),
    }
  },
  methods: {
    copyWorkout() {
      this.workout.user = {
        id: this.user.id, 
        username: this.user.username, 
        fullname: this.user.fullname,
      }
      this.workout.type = 'workoutToCopy'
      if (this.$store.state.main.workoutToCopy) {
        this.$store.dispatch("main/updateEntryInDb", this.workout)
      } else {
        this.$store.dispatch("main/addEntryToDb", this.workout)
      }
    },
    pairWorkout() {
      this.workout.user = {
        id: this.user.id, 
        username: this.user.username, 
        fullname: this.user.fullname,
      }
      this.workout.type = 'workoutToPair'
      if (this.$store.state.main.workoutToPair) {
        this.$store.dispatch("main/updateEntryInDb", this.workout)
      } else {
        this.$store.dispatch("main/addEntryToDb", this.workout)
      }
    },
    async deleteWorkout() {
      if (
        await this.$root.$confirm("Czy na pewno chcesz usunąć ten element?")
      ) {
        this.client.mutate({
          mutation: deleteWorkout,
          variables: {
            id: this.workout.id,
          },
          update: (cache, { data: { deleteWorkout } }) => {
            // read data from cache for chosen queries
            const data = cache.readQuery({
              query: getSingleUser,
              variables: { id: this.$route.params.id },
            })
            // find index of deleted item in cached user.workouts array
            const workoutIndex = data.user.workouts.findIndex(
              (workout) => workout.id == deleteWorkout.id
            )
            // remove deleted item from data
            data.user.workouts.splice(workoutIndex, 1)
            //write data back to cache
            this.client.writeQuery({ query: getSingleUser, data })
          },
        })
      }
    },
    showNotification(isWorkoutReady) {
      if (!isWorkoutReady) {
        this.$store.commit(
          "main/setNotification",
          "Ten trening nie ma jeszcze rozpiski"
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.workout {
  padding: 0.5rem 0;
}

h4 {
  color: white;
}

.workout__link {
  flex-basis: 100%;
  text-align: left;
}
</style>
