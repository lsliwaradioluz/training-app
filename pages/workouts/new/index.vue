<template>
  <div class="createworkout main">
    <WorkoutEditor :specific-data="$data" />
  </div>
</template>

<script>
import WorkoutEditor from '~/components/WorkoutEditor';
import mainQuery from '~/apollo/queries/workouts/new/main.gql';

export default {
  components: {
    WorkoutEditor, 
  },
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    return client.query({ query: mainQuery, variables: { username: context.route.query.username } })
      .then(({ data }) => {
        return {
          user: data.users[0],
        }
      });
  },
  data() {
    return {
      workout: {
        warmup: [],
        skillwork: [],
        strength: [],
        cardio: [],
        mobility: []
      },
      selectedDate: null, 
      selectedTime: null,
      currentSection: null,
      currentBlock: null,
      restIntervals: {
        singleExerciseRest: 180, 
        pairedExerciseRest: 90, 
        afterBlockRest: 180,
        warmupRest: 30 
      },
    }
  },
}
</script>