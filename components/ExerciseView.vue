<template>
  <div class="exercise-view columnfa">
    <div
      class="exercise-view__image" 
      :style="{ backgroundImage: exercise.image ? `url('${exercise.image.url}')` : 'none' }"></div>
    <div class="p11">
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
            <nuxt-link tag="button" type="button" to="edit" append>
              <i class="flaticon-writing fs-09" style="margin-right: .25rem" />
              Edytuj
            </nuxt-link>
            <button type="button" @click="deleteExercise">
              <i class="flaticon-trash fs-09" style="margin-right: .25rem" />
              Usuń
            </button>
          </template>
        </ContextMenu>
      </div>
      <transition name="accordion">
        <div class="mt1" v-show="showDescription">
          <p class="m00 fs-12" v-if="exercise.description">{{ exercise.description }}</p>
          <p class="m00 fs-12" v-else>To ćwiczenie nie ma jeszcze opisu. To znaczy, że Twój trener się obija i musisz go pogonić!</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import deleteExercise from '~/apollo/mutations/deleteExercise.gql';
  import mainQuery from '~/apollo/queries/exercises/main.gql';

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
              const data = cache.readQuery({ query: mainQuery });
              // find index of deleted item in cached user.workouts array 
              const exerciseIndex = data.exercises.findIndex(exercise => exercise.id == deleteExercise.exercise.id );
              // remove deleted item from cache 
              data.exercises.splice(exerciseIndex, 1);
              // write data back to the cache
              // this.client.writeQuery({ query: mainQuery, data: data });
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

  .exercise-view__image {
    background-size: cover;
    background-position: center;
    height: 70vh;
    border-bottom: 2px solid color(headers);
  }

  .dupa {
    overflow: hidden;
  }

</style>