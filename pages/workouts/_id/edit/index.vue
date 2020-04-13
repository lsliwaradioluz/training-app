<template>
  <div class="editworkout">
    <h1 class="mt0 mb1">Edytuj trening</h1>
    <WorkoutEditor :specific-data="$data" edit />
  </div>
</template>

<script>
import mainQuery from '~/apollo/queries/workouts/_id/edit/main.gql';
import mainWithCopiedQuery from '~/apollo/queries/workouts/_id/edit/mainWithCopied.gql';

export default {
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    let copiedWorkoutId = context.store.state.main.workoutToCopy ? context.store.state.main.workoutToCopy.id : null;
    return client.query({ query: copiedWorkoutId ? mainWithCopiedQuery : mainQuery, variables: { workoutid: context.route.params.id, userid: context.route.query.user, copiedWorkoutId: copiedWorkoutId } })
      .then(({ data }) => {
        const date = new Date(data.workout.scheduled);
        let hours = date.getHours() < 10 ? `0${date.getHours()}`: date.getHours();
        let minutes = date.getMinutes() < 10 ? `${date.getMinutes()}0` : date.getMinutes();
        const dateTimeArray = data.workout.scheduled.split('T');
        return {
          id: data.workout.id,
          user: data.user,
          previousWorkouts: copiedWorkoutId ? [data.copiedWorkout, ...data.user.workouts] : data.user.workouts,
          scheduled: data.workout.scheduled,
          selectedDate: dateTimeArray[0], 
          selectedTime: `${hours}:${minutes}`,
          sticky: data.workout.sticky,
          showSticky: data.workout.sticky,
          sections: data.workout.sections,
        }
      });
  },
}
</script>

