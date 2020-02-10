<template>
  <div class="workout main">
    <!-- Nagłówek -->
    <WorkoutPanel :workout-scheduled="workout.scheduled" :user="workout.user" />
    <Head class="mt0 pt05 pb05">Rozpiska</Head>
    <Carousel :pagination="false">
      <Routine v-for="(section, key) in sections" :key="key" :section="section" :section-name="key" />
    </Carousel>
    <Head class="mt0 pt05 pb05">Odpoczynek</Head>
    <div class="workout__rest tab p11">
      <div class="row pt05 pb05">
        <p class="t-green m00">Między pojedynczymi ćwiczeniami</p>
        <span class="row j-center a-center m00">{{ workout.singleExerciseRest }} sekund</span>
      </div>
      <div class="row pt05 pb05">
        <p class="t-green m00">Między ćwiczeniami w bloku</p>
        <span class="row j-center a-center m00">{{ workout.pairedExerciseRest }} sekund</span>
      </div>
    </div>
  </div>
</template>

<script>
import mainQuery from '~/apollo/queries/workouts/_id/main.gql';
import Routine from '~/components/Routine';
import WorkoutPanel from '~/components/WorkoutPanel';

export default {
  components: {
    Routine,
    WorkoutPanel, 
  },
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    return client.query({ query: mainQuery, variables: { id: context.route.params.id } })
      .then(({ data }) => {
        return {
          workout: data.workout
        }
      });
  }, 
  computed: {
    sections() {
      let sections = {};
      for (let key in this.workout) {
        if (Array.isArray(this.workout[key]) && this.workout[key].length > 0) {
          sections[key] = this.workout[key];
        }
      }
      return sections;
    },
  }
}
</script>

<style lang="scss" scoped>
  .workout__rest {
    
    p {
      flex-basis: 75%;
      border-right: 1px solid color(inputgray);
      padding: 0.5rem 0.5rem 0.5rem 0;
    }

    span {
      flex-basis: 25%;
      padding: 0.5rem 0 0.5rem 0.5rem;
    }
  }
</style>
