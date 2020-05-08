<template>
  <div class="create-workout">
    <LazyWrapper :loading="$apollo.loading">
      <Header>Nowy trening</Header>
      <WorkoutEditor :specific-data="$data" />
    </LazyWrapper>
  </div>
</template>

<script>
import mainQuery from '~/apollo/queries/workouts/new/main.gql';
import mainWithCopiedQuery from '~/apollo/queries/workouts/new/mainWithCopied.gql';

export default {
  apollo: {
    user: {
      query() {
        return this.$store.state.main.workoutToCopy ? mainWithCopiedQuery : mainQuery
      }, 
      variables() {
        return {
          id: this.$route.query.id,
          copiedWorkoutId: this.$store.state.main.workoutToCopy ? this.$store.state.main.workoutToCopy.id : null,
        }
      },
      manual: true, 
      result({ data, loading }) {
        if (!loading) {
          if (data.copiedWorkout) {
            data.user.workouts.unshift(data.copiedWorkout);
          }
          this.user = data.user;
        }
      }, 
    },
  },
  data() {
    return {
      user: Object,
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