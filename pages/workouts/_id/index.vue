<template>
  <div class="workout">
    <div class="workout__buttons row j-around mb05" v-if="workouts.length > 1">
      <button 
        type="button"
        class="t-small"
        :class="{ 't-green': index == currentWorkout }"
        v-for="(user, index) in users" 
        :key="index"
        @click="currentWorkout = index">{{ user | getName }}</button>
    </div>
    <div>
  <!-- NAGŁÓWEK -->
    <WorkoutPanel :workout="workout" :section="currentTranslate" />
  <!-- ROZPISKA  --> 
      <Head class="mt0 pt05 pb05">
        <div class="row j-between">
          <span>Rozpiska</span>
          <nuxt-link 
            v-if="$store.state.auth.user.admin"
            class="flaticon-play" 
            tag="i" 
            :to="{ path: 'assistant', query: { section: currentTranslate } }" 
            append></nuxt-link>
        </div>
      </Head>
      <div class="carousel-container">
        <Carousel
          @change-page="currentTranslate = $event" 
          :active="!maxEditorOpen"
          :start-from-page="$store.state.main.workoutAssistantState[workout.id] ? +$store.state.main.workoutAssistantState[workout.id].section : 0"
          :key="workout.id">
          <div class="p01 column" v-for="section in workout.sections" :key="section.id">
            <Routine 
              :section="section"
              @toggle-max-editor="maxEditorOpen = $event"
              @add-max="addMax($event)" 
              @subtract-max="subtractMax($event)"
              @upload-workout="uploadWorkout" />
          </div>
      </Carousel>
      </div>
    </div>
  </div>
</template>

<script>
  import mainQuery from '~/apollo/queries/workouts/_id/main.gql';
  import updateWorkout from '~/apollo/mutations/updateWorkout.gql';

  export default {
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
          return {
            workouts: data.workouts,
          }
        });
    },
    data() {
      return {
        client: this.$apollo.getClient(),
        maxEditorOpen: false,
        currentTranslate: 0,
        currentWorkout: 0,
      }
    },
    computed: {
      workout() {
        const workout = this.workouts[this.currentWorkout];
        workout.sections = workout.sections.filter(section => {
          return section.complexes.length > 0;
        });
        return workout;
      },
      filteredSections() {
        let sectionsClone = JSON.parse(JSON.stringify(this.workout.sections));
        sectionsClone.forEach((section, sectionindex) => {
          sectionsClone[sectionindex] = _.omit(section, '__typename', 'id');
          section.complexes.forEach((complex, complexindex) => {
            sectionsClone[sectionindex].complexes[complexindex] = _.omit(complex, '__typename', 'id');
            complex.units.forEach((unit, unitindex) => {
              sectionsClone[sectionindex].complexes[complexindex].units[unitindex] = _.omit(unit, '__typename', 'id');
              sectionsClone[sectionindex].complexes[complexindex].units[unitindex].exercise = unit.exercise.id;
            });
          });
        });
        return sectionsClone;
      },
      users() {
        let users = [];
        this.workouts.forEach(cur => {
          users.push(cur.user.fullname);
        });
        return users;
      },
      feedbackEditable() {
        return this.$store.state.auth.user.fullname == this.workout.user.fullname ? true : false;
      },
    }, 
    methods: {
      addMax({ unit, complex }) {
        let max = this.workout.sections[this.currentTranslate].complexes[complex].units[unit].max;
        if (max == null) this.workout.sections[this.currentTranslate].complexes[complex].units[unit].max = 0;
        this.workout.sections[this.currentTranslate].complexes[complex].units[unit].max++;
      },
      subtractMax({ unit, complex }) {
        let max = this.workout.sections[this.currentTranslate].complexes[complex].units[unit].max;
        if (max == null) this.workout.sections[this.currentTranslate].complexes[complex].units[unit].max = 0;
        this.workout.sections[this.currentTranslate].complexes[complex].units[unit].max--;
      }, 
      uploadWorkout() {
        let input = {
          where: {
            id: this.workout.id,
          },
          data: {
            sections: this.filteredSections,
          }
        }

        this.client.mutate({ mutation: updateWorkout, variables: { input: input }  })
          .then(res => {
            console.log(res);
          })  
      }
    },
    beforeRouteLeave(to, from, next) {
      if (!to.path.includes('assistant')) {
        this.$store.commit('main/resetWorkoutAssistantState', {});
      }
      next();
    }
  }
</script>
