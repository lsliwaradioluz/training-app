<template>
  <div class="workout">
  <!-- BUTTONY  -->
    <div v-show="!showWorkoutAssistant">
      <div class="workout__buttons row j-around mb05" v-if="workouts.length > 1">
        <button 
          type="button"
          class="t-small"
          :class="{ 't-green': index == currentWorkout }"
          v-for="(user, index) in users" 
          :key="index"
          @click="setCurrentWorkout(index)">
          {{ user | getName }}</button>
      </div>
      <div>
  <!-- NAGŁÓWEK -->
      <WorkoutPanel :workout="workoutNoEmptySections" @show-assistant="runWorkoutAssistant" />
  <!-- ROZPISKA  --> 
        <Head class="mt0 pt05 pb05">
          <div class="row j-between">
            <span>Rozpiska</span>
            <button type="button" @click="runWorkoutAssistant">
              <i class="flaticon-play"></i>
            </button>
          </div>
        </Head>
        <div class="carousel-container">
          <Carousel
            :active="!maxEditorOpen"
            :pagination="false"
            :start-from-page="currentSection[currentWorkout]"
            :key="`${showWorkoutAssistant}${currentWorkout}`"
            @change-page="setCurrentSection({ index: currentWorkout, section: $event })"
            :autoplay="workouts.length == 1"
            :autoplaySpeed="3">
            <div class="p01 column" v-for="section in workoutNoEmptySections.sections" :key="section.id">
              <Routine
                :section="section"
                @toggle-max-editor="maxEditorOpen = $event"
                @add-max="addMax($event)" 
                @subtract-max="subtractMax($event)"
                @upload-workout="uploadWorkout" />
            </div>
          </Carousel>
        </div>
        <!--  -->
      </div>
    </div>
  <!-- ASYSTENT  -->
    <div v-if="renderWorkoutAssistant">
      <!-- poniżej w change-page -->
      <Carousel 
        v-show="showWorkoutAssistant" 
        :pagination="false" 
        :start-from-page="currentWorkout"
        @change-page="setCurrentWorkout($event)">
        <WorkoutAssistant
          v-for="(workout, index) in workouts"
          :key="workout.id"
          :workout="workout"
          :workout-index="index"
          :section-index="currentSection[index]" 
          :is-screen-divided="workouts.length > 1" 
          @set-current-section="setCurrentSection({ index: currentWorkout, section: $event })" />
      </Carousel>
    </div>
  </div>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex';
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
        renderWorkoutAssistant: false,
      }
    },
    computed: {
      ...mapGetters({
        showWorkoutAssistant: 'assistant/showWorkoutAssistant',
        currentWorkout: 'assistant/currentWorkout',
        currentSection: 'assistant/currentSection',
      }),
      workoutNoEmptySections() {
        const workout = this.workouts[this.currentWorkout];
        workout.sections = workout.sections.filter(section => {
          return section.complexes.length > 0;
        });
        return workout;
      },
      filteredSections() {
        let sectionsClone = JSON.parse(JSON.stringify(this.workoutNoEmptySections.sections));
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
    }, 
    methods: {
      ...mapMutations({
        setCurrentWorkout: 'assistant/setCurrentWorkout',
        toggleWorkoutAssistant: 'assistant/toggleWorkoutAssistant', 
        clearAssistantState: 'assistant/clearAssistantState',
        setCurrentSection: 'assistant/setCurrentSection',
      }),
      addMax({ unit, complex }) {
        const currentSection = this.currentSection[this.currentWorkout];
        let max = this.workoutNoEmptySections.sections[currentSection].complexes[complex].units[unit].max;
        if (max == null) this.workoutNoEmptySections.sections[currentSection].complexes[complex].units[unit].max = 0;
        this.workoutNoEmptySections.sections[currentSection].complexes[complex].units[unit].max++;
      },
      subtractMax({ unit, complex }) {
        const currentSection = this.currentSection[this.currentWorkout];
        let max = this.workoutNoEmptySections.sections[currentSection].complexes[complex].units[unit].max;
        if (max == null) this.workoutNoEmptySections.sections[currentSection].complexes[complex].units[unit].max = 0;
        this.workoutNoEmptySections.sections[currentSection].complexes[complex].units[unit].max--;
      }, 
      uploadWorkout() {
        let input = {
          where: {
            id: this.workoutNoEmptySections.id,
          },
          data: {
            sections: this.filteredSections,
          }
        }

        this.client.mutate({ mutation: updateWorkout, variables: { input: input }  })
      }, 
      runWorkoutAssistant() {
        if (!this.renderWorkoutAssistant) {
          this.renderWorkoutAssistant = true;
        }
        this.toggleWorkoutAssistant();
      }
    },
    async beforeRouteLeave(to, from, next) {
      if (!to.path.includes('exercises')) {
        this.clearAssistantState();
      }
      // Jeżeli ktos przez przypadek użyje strzałki cofnij, by wyjść z asystenta, zapytaj go, czy na pewno tego chce
      if (this.showWorkoutAssistant) {
        if (await this.$root.$confirm('Czy na pewno chcesz wyjść z tego treningu?')) {
          this.toggleWorkoutAssistant(); 
        }
      } 
      next();
    }
  }
</script>

