<template>
  <div>
    <LazyWrapper :loading="$apollo.loading">
      <div class="exercises">
        <Header>
          <span>Ćwiczenia</span>
          <nuxt-link class="flaticon-plus-1 ml1 t-white" :to="{ path: 'new' }" append></nuxt-link>
        </Header>
        <p class="mb0">Dotknij karty ćwiczenia, aby wyświetlić szczegóły. Dodaj nowe, dotykając ikony plusa. Edytuj lub usuń ćwiczenie, rozwijająć menu kontekstowe przy jego karcie.</p>
        <CustomSearch 
          placeholder="Szukaj ćwiczenia"
          v-model="filter">
        </CustomSearch>
        <template v-if="filteredExercises.length > 0">
          <transition-group name="animate-list">
            <ExerciseTab 
              v-for="exercise in filteredExercises" 
              :key="exercise.id"
              :exercise="exercise" />
          </transition-group>
        </template>
        <p v-else>Brak ćwiczeń</p>
      </div>
    </LazyWrapper>
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
    data() {
      return {
        filter: '',
        exercises: [],
      }
    }, 
    computed: {
      filteredExercises() {
        let filteredExercises = [];
        let filter = this.filter.toLowerCase();
        if (filter !== '') {
          filteredExercises = this.exercises.filter(exercise => {
            const alias = exercise.alias ? exercise.alias : '';
            const exerciseName = exercise.name.toLowerCase() + alias.toLowerCase();
            const conditions = 
              exerciseName.includes(filter) 
              || filter.includes(exerciseName);
            return conditions;
          });
        } else {
          filteredExercises = this.exercises;
        }
        return filteredExercises;
      },
    }
  }
</script>