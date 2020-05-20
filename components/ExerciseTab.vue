<template>
  <div class="exercise-tab column pt05 pb05">
    <div class="row j-between">
      <nuxt-link 
        class="exercise-tab__link pr1 row" 
        :to="exercise.image ? `/exercises/${exercise.id}` : ``"
        tag="div" 
        @click.native="showNotification"
        append>
        <div>
          <h4 class="m00">{{ exercise.name | shortenExercise }}</h4>
          <p class="exercise-tab__description t-medium t-faded m00" v-if="exercise.alias">{{ exercise.alias | shortenAlias }}</p>
          <p class="exercise-tab__description t-medium t-faded m00" v-else>Brak alternatywnej nazwy</p>
        </div>
      </nuxt-link>
      <div class="row a-center">
        <ContextMenu v-if="user.admin">
          <template v-slot:trigger>
            <i class="flaticon-vertical-dots t-headers mr0"></i>
          </template>
          <template v-slot:options>
            <nuxt-link class="flaticon-pencil mr05" tag="button" type="button" :to="`${exercise.id}/edit`" append>Edytuj</nuxt-link>
            <button class="flaticon-trash fs-09 mr05" type="button" @click="deleteExercise">Usuń</button>
          </template>
        </ContextMenu>
        <span class="flaticon-right-arrow t-faded" :class="{ 't-headers': exercise.image }" v-else>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import deleteExercise from '~/apollo/mutations/deleteExercise.gql';
  import getAllExercises from '~/apollo/queries/getAllExercises.gql';
  
  export default {
    props: ['exercise'], 
    data() {
      return {
        client: this.$apollo.getClient(),
      }
    }, 
    computed: {
      image() {
        return this.exercise.image ? this.exercise.image.url : require('assets/images/exercise.jpg');
      },
      user() {
        return this.$store.getters['auth/user'];
      },
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
              cache.writeQuery({ query: getAllExercises, data: data });
            } 
          });
          
        }
      },
      showNotification() {
        if (!this.exercise.image) {
          this.$store.commit('main/setNotification', 'To ćwiczenie nie ma jeszcze zdjęcia.');
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  h4 {
    color: white;
  }

  .exercise-tab__link {
    flex-basis: 100%;
  }
</style>