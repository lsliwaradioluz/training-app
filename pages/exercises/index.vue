<template>
  <div class="exercises">
    <div v-if="!$apollo.loading">
      <Head>
        <div class="row j-between">
          <h3 class="m00">
            <input class="input--invisible" v-model="filter" placeholder="Znajdź ćwiczenie..." spellcheck="false" autocomplete="off">
          </h3>
          <nuxt-link class="flaticon-plus ml1" tag="i" :to="{ path: 'new' }" append></nuxt-link>
        </div>
      </Head>
      <transition-group name="animate-list">
        <ExerciseTab 
          v-for="exercise in filteredExercises" 
          :key="exercise.id"
          :exercise="exercise" />
      </transition-group>
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