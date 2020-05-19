<template>
  <div class="workout row j-between a-center" :class="{ sticky: workout.sticky }">
  <!-- MAIN TAB -->
    <nuxt-link 
      class="workout__link" 
      tag="button"
      :to="workout.ready ? `/workouts/${this.workout.id}` : ``"
      @click.native="showNotification(workout.ready)">
      <div v-if="!workout.sticky">
        <h4 class="m00">{{ workout.scheduled | reverseDate }}</h4>
        <p class="m00 t-medium t-faded">{{ workout.scheduled | getDayName }} {{ workout.scheduled | getTime }}</p>
      </div>
      <div v-else>
        <h4 class="m00" v-if="workout.name">{{ workout.name }}</h4>
        <h4 class="m00" v-else>Podwieszony</h4>
        <p class="m00 t-medium t-faded">dodano {{ workout.createdAt | reverseDate }}</p>
      </div>
    </nuxt-link>
    <span
      class="flaticon-right-arrow t-faded"
      :class="{ 't-headers': workout.ready }"
      v-if="!$route.path.includes('users')">
    </span>
    <div class="row a-center" v-else>
      <ContextMenu>
        <template v-slot:trigger>
          <i class="flaticon-vertical-dots t-headers"></i>
        </template>
        <template v-slot:options>
          <nuxt-link
            class="flaticon-pencil mr05"
            tag="button"
            type="button" 
            :to="{ path: `/workouts/${workout.id}/edit`, query: { user: user.id } }">
            Edytuj
          </nuxt-link>
          <nuxt-link
            class="flaticon-copy mr05"
            type="button"
            tag="button"
            to="/users"
            @click.native="copyWorkout"
            v-if="workout.ready">
            Kopiuj
          </nuxt-link>
          <nuxt-link 
            class="flaticon-double-arrow-cross-of-shuffle mr05"
            type="button" 
            tag="button"
            to="/users"
            @click.native="pairWorkout" 
            v-if="workout.ready">
            Paruj
          </nuxt-link>
          <button class="flaticon-trash mr05" type="button" @click="deleteWorkout">
            Usuń
          </button>
        </template>
      </ContextMenu>
    </div>
  </div>
</template>

<script>
  import deleteWorkout from '~/apollo/mutations/deleteWorkout.gql';
  import getUserQuery from '~/apollo/queries/users/_id/main.gql';

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
              const data = cache.readQuery({ query: getUserQuery, variables: { id: this.$route.params.id } });
              // find index of deleted item in cached user.workouts array 
              const workoutIndex = data.user.workouts.findIndex(workout => workout.id == deleteWorkout.workout.id );
              // remove deleted item from data 
              data.user.workouts.splice(workoutIndex, 1);
              //write data back to cache 
              this.client.writeQuery({ query: getUserQuery, data: data });
            }
          })
        }
      },
      showNotification(isWorkoutReady) {
        if (!isWorkoutReady) {
          this.$store.commit('main/setNotification', 'Ten trening nie ma jeszcze rozpiski');
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