<template>
  <div class="workout column" :class="{ sticky: workout.sticky }">
  <!-- MAIN TAB -->
    <div class="row j-between a-stretch">
      <nuxt-link 
        class="workout__link" 
        tag="button"
        :to="workout.ready ? `/workouts/${this.workout.id}` : ``"
        @click.native="showNotification(workout.ready)">
        <div v-if="!workout.sticky">
          <h4 class="m00">{{ workout.scheduled | reverseDate }}</h4>
          <p class="m00 fs-12 faded">{{ workout.scheduled | getDayName }} {{ workout.scheduled | getTime }}</p>
        </div>
        <div v-else>
          <h4 class="m00">Podwieszony</h4>
          <p class="m00 fs-12 faded">dodano {{ workout.createdAt | reverseDate }}</p>
        </div>
      </nuxt-link>
      <div class="row a-center" v-if="!$route.path.includes('users')">
        <nuxt-link
          class="button-primary b-headers button--rounded"
          :class="{ 'button--inactive': !workout.ready }"
          :to="`/workouts/${this.workout.id}`" 
          tag="button"
          :disabled="!workout.ready">Plan</nuxt-link>
      </div>
      <div class="row a-center" v-else>
        <ContextMenu>
          <template v-slot:trigger>
            <i class="flaticon-vertical-dots t-headers"></i>
          </template>
          <template v-slot:options>
            <nuxt-link
              tag="button"
              type="button" 
              :to="{ path: `/workouts/${workout.id}/edit`, query: { user: user.id } }">
              <i class="flaticon-writing"></i>
              Edytuj
              </nuxt-link>
            <nuxt-link
              type="button"
              tag="button"
              to="/users"
              @click.native="copyWorkout"
              v-if="workout.ready">
              <i class="flaticon-copy"></i>
              Kopiuj
            </nuxt-link>
            <nuxt-link 
              type="button" 
              tag="button"
              to="/users"
              @click.native="pairWorkout" 
              v-if="workout.ready">
              <i class="flaticon-double-arrow-cross-of-shuffle"></i>
              Paruj
            </nuxt-link>
            <button type="button" @click="deleteWorkout">
              <i class="flaticon-trash"></i>
              Usuń
            </button>
          </template>
        </ContextMenu>
      </div>
    </div>
  </div>
</template>

<script>
  import deleteWorkout from '~/apollo/mutations/deleteWorkout.gql';
  import getUserQuery from '~/apollo/queries/users/_id/main.gql';
  import getWorkoutsQuery from '~/apollo/queries/workouts/new/main.gql';
  export default {
    props: ['workout', 'user'],
    data() {
      return {
        client: this.$apollo.getClient(),
        errorModalVisible: false, 
      }
    },
    methods: {
      copyWorkout() {
        const workoutToCopy = {
          id: this.workout.id,
          user: this.user.username, 
          scheduled: this.workout.scheduled
        }
        this.showButtonsPanel = false;
        this.$store.commit('main/copyWorkout', workoutToCopy);
      },
      pairWorkout() {
        const workoutToPair = {
          id: this.workout.id,
          user: this.user.username, 
          scheduled: this.workout.scheduled
        }
        this.$store.commit('main/pairWorkout', workoutToPair);
      },
      async deleteWorkout() {
        const input = {
          where: {
            id: this.workout.id,
          },
        }
        if (await this.$root.$confirm("Czy na pewno chcesz usunąć ten element?")) {
          this.client.mutate({ 
            mutation: deleteWorkout, 
            variables: { 
              input: input 
            },
            update: (cache, { data: { deleteWorkout } }) => {
              // read data from cache for chosen queries
              const data_1 = cache.readQuery({ query: getUserQuery, variables: { id: this.$route.params.id } });
              const data_2 = cache.readQuery({ query: getWorkoutsQuery, variables: { id: this.$route.params.id } });
              // find index of deleted item in cached user.workouts array 
              const workoutIndex_1 = data_1.user.workouts.findIndex(workout => workout.id == deleteWorkout.workout.id );
              const workoutIndex_2 = data_2.user.workouts.findIndex(workout => workout.id == deleteWorkout.workout.id );
              // remove deleted item from data 
              data_1.user.workouts.splice(workoutIndex_1, 1);
              data_2.user.workouts.splice(workoutIndex_2, 1);
              //write data back to cache 
              this.client.writeQuery({ query: getUserQuery, data: data_1 });
              if (workoutIndex_2 != -1) {
                this.client.writeQuery({ query: getWorkoutsQuery, data: data_2 });
              }
            }
          })
        }
      },
      showNotification(isWorkoutReady) {
        if (!isWorkoutReady) {
          this.$store.commit('main/setNotification', 'Ten trening nie ma jeszcze rozpiski.');
        }
      }
    }
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