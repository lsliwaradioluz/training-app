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
    <p class="tab p11" v-if="!workout.sticky">
      Wykonując ćwiczenia pojedynczo, odpoczywaj przez <span class="t-green">{{ workout.singleExerciseRest }}</span> sekund między seriami. Jeżeli przeplatasz ćwiczenia w ramach bloku, odpoczywaj przez <span class="t-green">{{ workout.pairedExerciseRest }}</span> sekund.
    </p>
    <p class="tab p11" v-else>
      Odpoczywaj tyle, ile potrzebujesz, starając się wykonywać ćwiczenie jedno po drugim z minimalną przerwą.
    </p>
  <!-- FEEDBACK -->
    <div v-if="feedbackEditable && !workout.sticky">
      <Head class="mt0 pt05 pb05">Wiadomość dla trenera</Head>
      <Feedback :workout="workout" />
    </div>
    <div v-else-if="!workout.sticky && !feedbackEditable && workout.feedback">
      <Head class="mt0 pt05 pb05">Wiadomość dla trenera</Head>
      <p class="m00 tab">{{ workout.feedback }}</p>
    </div>
    <div v-else-if="!workout.sticky && !feedbackEditable && !workout.feedback">
      <Head class="mt0 pt05 pb05">Wiadomość dla trenera</Head>
      <p class="m00 tab">Użytkownik nie dodał wiadomości</p>
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
      feedbackEditable() {
        return this.$store.state.auth.user.fullname == this.workout.user.fullname ? true : false;
      },
      sections() {
        let sections = {};
        for (let key in this.workout) {
          if (Array.isArray(this.workout[key]) && this.workout[key].length > 0) {
            sections[key] = this.workout[key];
          }
        }
        return sections;
      }
    }, 
  }
</script>
