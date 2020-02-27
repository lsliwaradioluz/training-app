<template>
  <div class="editworkout">
    <WorkoutEditor :specific-data="$data" edit />
  </div>
</template>

<script>
import WorkoutEditor from '~/components/WorkoutEditor';
import mainQuery from '~/apollo/queries/workouts/_id/edit/main.gql';

export default {
  components: {
    WorkoutEditor,
  },
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    return client.query({ query: mainQuery, variables: { id: context.route.params.id } })
      .then(({ data }) => {
        const date = new Date(data.workout.scheduled);
        let hours = date.getHours();
        let minutes = date.getMinutes() < 10 ? `${date.getMinutes()}0` : date.getMinutes();
        const dateTimeArray = data.workout.scheduled.split('T');
        return {
          id: data.workout.id,
          user: data.workout.user,
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

