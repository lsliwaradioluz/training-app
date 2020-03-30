<template>
  <div class="workout tab column" :class="{ sticky: workout.sticky }">
  <!-- MAIN TAB -->
    <div class="row j-between a-stretch">
      <nuxt-link class="workout__link" tag="div" :to="`/workouts/${this.workout.id}`">
        <div v-if="!workout.sticky">
          <h3 class="m00">{{ workout.scheduled | reverseDate }}</h3>
          <p class="m00 t-small">{{ workout.scheduled | getDayName }} {{ workout.scheduled | getTime }}</p>
        </div>
        <div v-else>
          <h3 class="m00">Podwieszony</h3>
          <p class="m00 t-small">dodano {{ workout.createdAt | reverseDate }}</p>
        </div>
      </nuxt-link>
      <div v-if="!$route.path.includes('users')">
        <nuxt-link
          class="button--primary"
          :class="{ 'button--inactive': !workout.ready }"
          :to="`/workouts/${this.workout.id}`" 
          tag="button"
          :disabled="!workout.ready">Plan</nuxt-link>
      </div>
      <div class="row a-center" v-else>
        <ContextMenu>
          <template v-slot:trigger>
            <i class="flaticon-vertical-dots t-green"></i>
          </template>
          <template v-slot:options>
            <nuxt-link
              tag="button"
              type="button" 
              :to="{ path: `/workouts/${workout.id}/edit`, query: { scheduled: workout.scheduled } }">
              <i class="flaticon-writing"></i>
              Edytuj
              </nuxt-link>
            <nuxt-link
              type="button"
              tag="button"
              to="/users"
              @click.native="copyWorkout">
              <i class="flaticon-paper"></i>
              Kopiuj
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
  import mainQuery from '~/apollo/queries/users/_name/main.gql';

  export default {
    props: ['workout', 'user'],
    data() {
      return {
        client: this.$apollo.getClient(),
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
              // read data from cache for this query
              const data = cache.readQuery({ query: mainQuery, variables: { username: this.$route.params.name } });
              // find index of deleted item in cached user.workouts array 
              const workoutIndex = data.users[0].workouts.findIndex(workout => {
                return workout.id == deleteWorkout.workout.id;
              });
              // remove deleted item from cache 
              data.users[0].workouts.splice(workoutIndex, 1);
              // write data back to the cache
              this.client.writeQuery({ query: mainQuery, data: data });
            }
          })
        }
      },
    }
  }
</script>

<style lang="scss" scoped>

  .workout__link {
    flex-basis: 100%;
  }

  .sticky {
    position: relative;
    // overflow: hidden;
    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      height: 100%;
      width: 3px;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      background-color: color(green);
    }
  }
</style>