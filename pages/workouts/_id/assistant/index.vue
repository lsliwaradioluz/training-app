<template>
  <div class="workout-assistant-page column j-between">      
    <WorkoutAssistant 
      v-for="workout in workouts"
      :workout="workout"
      :key="workout.id"
      :divided-screen-mode="workouts.length > 1" />
  </div>
</template>

<script>
import mainQuery from '~/apollo/queries/workouts/_id/assistant/main.gql';
import WorkoutAssistant from '~/components/WorkoutAssistant';


export default {
  layout: 'assistant',
  components: {
    WorkoutAssistant, 
  },
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    let IDs;
    if (context.store.state.main.workoutToPair) {
      IDs = [context.route.params.id, context.store.state.main.workoutToPair.id];
    } else {
      IDs = [context.route.params.id];
    }
    return client.query({ query: mainQuery, variables: { ids: IDs } })
      .then(({ data }) => {
        let workouts = data.workouts;
        data.workouts.forEach((workout, index) => {
          let sections = workout.sections.filter(section => {
            return section.complexes.length > 0;
          });
          workouts[index].sections = sections;
        });

        return {
          workouts: workouts,
        }
      });
  },
}
</script>

<style lang="scss" scoped>
  .workout-assistant-page {
    height: 100vh;
  }

  .workout-assistant:nth-child(2) {
    border-top: 1px solid color(green);
  }

  @media (orientation: landscape) {
    .workout-assistant-page {
      height: auto;
    }
  }
</style>