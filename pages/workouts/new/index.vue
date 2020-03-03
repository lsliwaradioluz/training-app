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
          rest: 45, 
          complexes: [

          ]
        },
        { 
          name: 'Skillwork',
          rest: 40, 
          complexes: [

          ]
        },
        { 
          name: 'Strength',
          rest: 180, 
          complexes: [

          ]
        },
        { 
          name: 'Cardio',
          rest: 60, 
          complexes: [

          ]
        },
        { 
          name: 'Mobility',
          rest: 40, 
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