<template>
  <div class="workout">
    <div v-show="!$store.state.assistant.showWorkoutAssistant">
      <div class="workout__buttons row j-around mb05" v-if="workouts.length > 1">
        <button 
          type="button"
          class="t-small"
          :class="{ 't-green': index == currentWorkout }"
          v-for="(user, index) in users" 
          :key="index"
          @click="$store.commit('assistant/setCurrentWorkout', index)">{{ user | getName }}</button>
      </div>
      <div>
    <!-- NAGŁÓWEK -->
      <WorkoutPanel :workout="workout" @show-assistant="showWorkoutAssistant = true" />
    <!-- ROZPISKA  --> 
        <Head class="mt0 pt05 pb05">
          <div class="row j-between">
            <span>Rozpiska</span>
            <button type="button" @click="$store.commit('assistant/toggleWorkoutAssistant')"><i class="flaticon-play"></i></button>
          </div>
        </Head>
        <div class="carousel-container">
          <Carousel 
            :pagination="false"
            :active="!maxEditorOpen"
            :start-from-page="currentSection"
            :key="workout.id"
            @change-page="$store.commit('assistant/setCurrentSection', { index: currentWorkout, section: $event })">
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
    <div v-show="$store.state.assistant.showWorkoutAssistant">
      <Carousel :is-shown="$store.state.assistant.showWorkoutAssistant" :pagination="false" @change-page="$store.commit('assistant/setCurrentWorkout', $event)">
        <WorkoutAssistant
          v-for="(workout, index) in workouts"
          :index="index"
          :workout="workout"
          :section-index="currentSection"
          :key="workout.id"
          :is-screen-divided="workouts.length > 1" />
      </Carousel>
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
      }
    },
    computed: {
      currentWorkout() {
        return this.$store.state.assistant.currentWorkout;
      },
      currentSection() {
        return this.$store.state.assistant.currentSection[this.currentWorkout];
      },
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
        let max = this.workout.sections[this.currentSection].complexes[complex].units[unit].max;
        if (max == null) this.workout.sections[this.currentSection].complexes[complex].units[unit].max = 0;
        this.workout.sections[this.currentSection].complexes[complex].units[unit].max++;
      },
      subtractMax({ unit, complex }) {
        let max = this.workout.sections[this.currentSection].complexes[complex].units[unit].max;
        if (max == null) this.workout.sections[this.currentSection].complexes[complex].units[unit].max = 0;
        this.workout.sections[this.currentSection].complexes[complex].units[unit].max--;
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
    beforeRouteEnter(to, from, next) {
      if (!from.path.includes('exercises')) {
        next(vm => {
          vm.$store.commit('assistant/clearAssistantState');
        });
      } else {
        next();
      }
      
    }, 
    async beforeRouteLeave(to, from, next) {
      // Jeżeli ktos przez przypadek użyje strzałki cofnij, by wyjść z asystenta, zapytaj go, czy na pewno tego chce
      if (this.$store.state.assistant.showWorkoutAssistant) {
        if (await this.$root.$confirm('Czy na pewno chcesz wyjść z tego treningu?')) {
          this.$store.commit('assistant/toggleWorkoutAssistant');
          next();
        }
      } else {
        next();
      }
    }
  }
</script>

