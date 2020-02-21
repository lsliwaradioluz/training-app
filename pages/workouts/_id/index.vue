<template>
  <div class="workout main">
  <!-- Nagłówek -->
    <WorkoutPanel :workout="workout" />
  <!-- Rozpiska  -->
    <Head class="mt0 pt05 pb05">Rozpiska</Head>
    <Carousel :pagination="false" :active="sections.length > 1">
      <Routine 
        v-for="(section, key) in sections" 
        :key="key" 
        :section="section" 
        :section-name="key"/>
    </Carousel>
  <!-- Przerwy  -->
    <Head class="mt0 pt05 pb05">Odpoczynek</Head>
    <p class="tab p11 m00" v-if="!workout.sticky">
      Wykonując ćwiczenia pojedynczo, odpoczywaj przez <span class="t-green">{{ workout.singleExerciseRest }} sekund</span> między seriami. Jeżeli przeplatasz ćwiczenia w ramach bloku, odpoczywaj przez <span class="t-green">{{ workout.pairedExerciseRest }} sekund</span>.
    </p>
    <p class="tab p11 m00" v-else>
      Odpoczywaj tyle, ile potrzebujesz, starając się wykonywać ćwiczenie jedno po drugim z minimalną przerwą.
    </p>
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
