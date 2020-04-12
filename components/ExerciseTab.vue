<template>
  <div class="exercise-tab column pt05 pb05">
    <div class="row j-between a-stretch">
      <nuxt-link class="exercise-tab__link pr1 row" :to="exercise.id" tag="div" append>
        <div class="avatar mr1" :style="{ backgroundImage: `url('${image}')` }"></div>
        <div>
          <h4 class="m00">{{ exercise.name | shortenExercise }}</h4>
          <p class="exercise-tab__description m00" v-if="exercise.alias">{{ exercise.alias | shortenAlias }}</p>
          <p class="exercise-tab__description m00" v-else>Brak alternatywnej nazwy</p>
        </div>
      </nuxt-link>
      <div class="row a-center">
        <ContextMenu>
          <template v-slot:trigger>
            <i class="flaticon-vertical-dots"></i>
          </template>
          <template v-slot:options>
            <button type="button" @click="deleteExercise">
              <i class="flaticon-trash fs-09" style="margin-right: .25rem"></i>
              Usuń
            </button>
            <nuxt-link tag="button" type="button" :to="`${exercise.id}/edit`" append>
              <i class="flaticon-writing fs-09" style="margin-right: .25rem"></i>
              Edytuj
            </nuxt-link>
          </template>
        </ContextMenu>
      </div>
    </div>
  </div>
</template>

<script>
  import deleteExercise from '~/apollo/mutations/deleteExercise.gql';
  import mainQuery from '~/apollo/queries/exercises/main.gql';
  
  export default {
    props: ['exercise'], 
    data() {
      return {
        client: this.$apollo.getClient(),
      }
    }, 
    computed: {
      image() {
        return this.exercise.image ? this.exercise.image.url : require('assets/images/user.svg');
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
              cache.writeQuery({ query: mainQuery, data: data });
            } 
          });
          
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  .exercise-tab__link {
    flex-basis: 100%;
  }

  .exercise-tab__description {
    font-size: 12px;
    opacity: 0.4;
  }
</style>