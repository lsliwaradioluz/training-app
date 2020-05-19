<template>
  <div class="exercise-view column">
    <div
      class="image" 
      :style="{ backgroundImage: exercise.image ? `url('${exercise.image.url}')` : 'none' }">
    </div>
    <div class="text p11">
      <div class="row j-between a-center">
        <div class="dupa">
          <MovingText>
            <h3 class="m00">{{ exercise.name }}</h3>
          </MovingText>
          <p class="m00 t-small t-faded">{{ exercise.alias }}</p>
        </div>
        <ContextMenu v-if="$store.state.auth.user.admin" bottom>
          <template v-slot:trigger>
            <i class="flaticon-vertical-dots"></i>
          </template>
          <template v-slot:options>
            <nuxt-link class="flaticon-pencil" tag="button" type="button" to="edit" append>Edytuj</nuxt-link>
            <button class="flaticon-trash" type="button" @click="deleteExercise">Usuń</button>
          </template>
        </ContextMenu>
      </div>
    </div>
  </div>
</template>

<script>
  import deleteExercise from '~/apollo/mutations/deleteExercise.gql';
  import getAllExercises from '~/apollo/queries/getAllExercises.gql';

  export default {
    props: {
      exercise: {
        type: Object,
        default: () => {
          return { name: '', technique: '' }
        }
      },
    },
    data() {
      return {
        client: this.$apollo.getClient(),
        showButtonsPanel: false,
        showDescription: true,
      }
    },
    methods: {
      async deleteExercise() {
        if (await this.$root.$confirm('Na pewno chcesz usunąć to ćwiczenie?')) {
          const input = {
            where: {
              id: this.exercise.id
            }
          }

          this.client.mutate({ 
            mutation: deleteExercise, 
            variables: { 
              input: input 
            }, 
            update: (cache, { data: { deleteExercise } }) => {
              // read data from cache for this query
              const data = cache.readQuery({ query: getAllExercises });
              // find index of deleted item in cached user.workouts array 
              const exerciseIndex = data.exercises.findIndex(exercise => exercise.id == deleteExercise.exercise.id );
              // remove deleted item from cache 
              data.exercises.splice(exerciseIndex, 1);
              // write data back to the cache
              // this.client.writeQuery({ query: getAllExercises, data: data });
            } 
          })
          .then(res => {
            this.$router.go(-1);
          });
        }
      }, 
    },
  }
</script>

<style lang="scss" scoped>

  .exercise-view {
    height: 100vh;
  }

  .image {
    background-size: cover;
    background-position: center;
    flex-basis: 90%;
    flex-shrink: 1;
    border-bottom: 2px solid color(headers);
  }

  .text {
    flex-basis: 10%;
    flex-grow: 1;
  }

  .dupa {
    overflow: hidden;
  }

</style>