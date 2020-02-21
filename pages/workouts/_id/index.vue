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
      Wykonując ćwiczenia pojedynczo, odpoczywaj przez <span class="t-green">{{ workout.singleExerciseRest }} sekund</span> między seriami. Jeżeli przeplatasz ćwiczenia w ramach bloku, odpoczywaj przez <span class="t-green">{{ workout.pairedExerciseRest }} sekund</span>.
    </p>
    <p class="tab p11" v-else>
      Odpoczywaj tyle, ile potrzebujesz, starając się wykonywać ćwiczenie jedno po drugim z minimalną przerwą.
    </p>
  <!-- FEEDBACK -->
    <div v-if="!workout.sticky">
      <Head class="mt0 pt05 pb05">
        <div class="row j-between">
          <span>Wiadomość dla trenera</span>
          <i class="flaticon-list" @click="editFeedback = !editFeedback" v-if="feedbackEditable"></i>
        </div>   
      </Head>
      <div class="tab" v-if="workout.feedback">
        <textarea class="invisible--input" rows="4" spellcheck="false" placeholder="Jak Ci poszło?" v-model="workout.feedback" :disabled="!editFeedback"></textarea>
        <button class="button--primary" type="button" @click="sendFeedback" v-if="editFeedback">Zapisz</button>
      </div>
    </div>
  </div>
</template>

<script>
  import mainQuery from '~/apollo/queries/workouts/_id/main.gql';
  import updateWorkout from '~/apollo/mutations/updateWorkout.gql';
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
    data() {
      return {
        client: this.$apollo.getClient(),
        editFeedback: false
      }
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
      feedbackEditable() {
        return this.$store.state.auth.user.fullname == this.workout.user.fullname ? true : false;
      }
    }, 
    methods: {
      sendFeedback() {
        const input = {
          where: {
            id: this.workout.id,
          },
          data: {
            feedback: this.workout.feedback
          }
        }

        this.client.mutate({ mutation: updateWorkout, variables: { input: input }  })
          .then(res => {
            this.editFeedback = false;
          })  
          
      }
    }
  }
</script>
