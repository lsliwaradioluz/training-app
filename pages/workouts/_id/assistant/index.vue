<template>
  <div class="workout-assistant-page column j-between" :style="{ backgroundImage: image }">
    <WorkoutAssistant 
      v-for="workout in workouts"
      :workout="workout"
      :key="workout.id"
      :divided-screen-mode="workouts.length > 1" 
      @set-current-state="setWorkoutAssistantState($event, workout.id)" />
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
  computed: {
    image() {
      if (this.workouts.length > 1) {
        return `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://media.giphy.com/media/e2nYWcTk0s8TK/giphy.gif')`;
      } else {
        return `black`;
      }
    }
  },
  methods: {
    setWorkoutAssistantState(state, id) {
      this.$store.commit('main/setWorkoutAssistantState', { id: id, state: state });
    }
  }
}
</script>

<style lang="scss" scoped>
  .workout-assistant-page {
    height: 100vh;
    background-size: cover;
    background-position: center;
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