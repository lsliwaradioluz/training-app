<template>
  <div class="createworkout">
    <WorkoutEditor :specific-data="$data" />
  </div>
</template>

<script>
import WorkoutEditor from '~/components/WorkoutEditor';
import mainQuery from '~/apollo/queries/workouts/new/main.gql';
import mainWithCopiedQuery from '~/apollo/queries/workouts/new/mainWithCopied.gql';

export default {
  components: {
    WorkoutEditor, 
  },
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    let copiedWorkoutId = context.store.state.main.workoutToCopy;
    return client.query({ query: copiedWorkoutId ? mainWithCopiedQuery : mainQuery, variables: { username: context.route.query.username, copiedWorkoutId: copiedWorkoutId } })
      .then(({ data }) => {
        return {
          user: data.users[0],
          previousWorkouts: copiedWorkoutId ? [data.copiedWorkout, ...data.users[0].workouts] : data.users[0].workouts,
        }
      });
  },
  data() {
    return {
      sections: [
        { 
          name: 'Rozgrzewka',
          complexes: [

          ]
        },
        { 
          name: 'Skillwork',
          complexes: [

          ]
        },
        { 
          name: 'Strength',
          complexes: [

          ]
        },
        { 
          name: 'Cardio',
          complexes: [

          ]
        },
        { 
          name: 'Mobility',
          complexes: [

          ]
        },
      ],
      showSticky: false,
      sticky: false,
      selectedDate: new Date().toISOString().split('T')[0], 
      selectedTime: "18:00:00",
    }
  },
}
</script>