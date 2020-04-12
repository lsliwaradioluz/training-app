<template>
  <div class="exercises">
    <div v-if="!$apollo.loading">
      <p>Dotknij karty ćwiczenia, aby wyświetlić szczegóły. Dodaj nowe, dotykając ikony plusa. Edytuj lub usuń ćwiczenie, rozwijająć menu kontekstowe przy jego karcie.</p>
      <h3 class="row j-between mb05">
        <span>Lista ćwiczeń</span>
        <nuxt-link class="flaticon-plus ml1" tag="i" :to="{ path: 'new' }" append></nuxt-link>
      </h3>
      <CustomSearch 
        placeholder="Szukaj ćwiczenia"
        v-model="filter"
        />
      <transition-group name="animate-list" v-if="filteredExercises.length > 0">
        <ExerciseTab 
          v-for="exercise in filteredExercises" 
          :key="exercise.id"
          :exercise="exercise" />
      </transition-group>
      <p v-else>Brak ćwiczeń</p>
    </div>
    <Placeholder v-else />
  </div>
</template>

<script>
  import mainQuery from '~/apollo/queries/exercises/main.gql';

  export default {
    apollo: {
      exercises: {
        query: mainQuery, 
      }
    },
    // asyncData(context) {
    //   let client = context.app.apolloProvider.defaultClient;
    //   return client.query({ query: mainQuery })
    //     .then(({ data }) => {
    //       return {
    //         exercises: data.exercises
    //       }
    //     });
    // },
    data() {
      return {
        filter: ''
      }
    }, 
    computed: {
      filteredExercises() {
        let filteredExercises = [];
        let filter = this.filter.toLowerCase();
        if (filter !== '') {
          filteredExercises = this.exercises.filter(exercise => {
            const exerciseName = exercise.name.toLowerCase();
            return exerciseName.includes(filter) || filter.includes(exerciseName);
          });
        } else {
          filteredExercises = this.exercises;
        }
        return filteredExercises;
      },
    }
  }
</script>