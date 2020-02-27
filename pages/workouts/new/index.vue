<template>
  <div class="createworkout">
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