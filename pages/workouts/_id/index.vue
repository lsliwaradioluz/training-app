<template>
  <div>
    <div class="workout" v-if="!$apollo.loading">
      <div v-show="!showWorkoutAssistant">
        <h1 class="mt0 mb1">Trening</h1>
        <!-- <p class="t-faded">{{ workoutWithoutEmptySections.scheduled | getDayName }} {{ workoutWithoutEmptySections.scheduled | reverseDate }}</p> -->
        <!-- <p>Przesuwaj palcem w lewo, by przeglądać rozpiskę treningową. Rozwiń <i class="flaticon-vertical-dots fs-10"></i> by włączyć asystenta lub dodać wyniki.</p> -->
        <WorkoutPanel
          :workout="workoutWithoutEmptySections" 
          @show-assistant="runWorkoutAssistant"
          @edit-score="scoreEditorOpen = true" />
        <div class="row mb1" v-if="workouts.length > 1">
          <button 
            class="button-secondary"
            :class="{ 'button-secondary--active': index == currentWorkout }"
            type="button"
            v-for="(user, index) in users" 
            :key="index"
            @click="setCurrentWorkout(index)">
            {{ user | getName }}</button>
        </div>
        <div>
          <div class="carousel-container">
            <Carousel
              :active="!scoreEditorOpen"
              :pagination="false"
              :start-from-page="currentSection[currentWorkout]"
              :key="`${showWorkoutAssistant}${currentWorkout}`"
              @change-page="setCurrentSection({ index: currentWorkout, section: $event })">
              <div class="p01 column" v-for="section in workoutWithoutEmptySections.sections" :key="section.id">
                <Routine
                  :section="section"
                  :score-editor-open="scoreEditorOpen"
                  @close-score-editor="scoreEditorOpen = $event"
                  @add-max="addMax($event)" 
                  @subtract-max="subtractMax($event)"
                  @upload-workout="uploadWorkout" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    <!-- ASYSTENT  -->
      <div v-if="renderWorkoutAssistant">
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
    <Placeholder v-else />
  </div>
</template>

<script>
  import { mapMutations, mapGetters } from 'vuex';
  import mainQuery from '~/apollo/queries/workouts/_id/main.gql';
  import updateWorkout from '~/apollo/mutations/updateWorkout.gql';

  export default {
    apollo: {
      workouts: {
        query: mainQuery, 
        variables() {
          let IDs;
          if (this.$store.state.main.workoutToPair) {
            IDs = [this.$route.params.id, this.$store.state.main.workoutToPair.id];
          } else {
            IDs = [this.$route.params.id];
          }
          return {
            ids: IDs
          }
        }
      }
    },
    data() {
      return {
        client: this.$apollo.getClient(),
        scoreEditorOpen: false,
        renderWorkoutAssistant: false,
      }
    },
    computed: {
      ...mapGetters({
        showWorkoutAssistant: 'assistant/showWorkoutAssistant',
        currentWorkout: 'assistant/currentWorkout',
        currentSection: 'assistant/currentSection',
      }),
      workoutWithoutEmptySections() {
        const workout = this.workouts[this.currentWorkout];
        workout.sections = workout.sections.filter(section => {
          return section.complexes.length > 0;
        });
        return workout;
      },
      filteredSections() {
        let sectionsClone = JSON.parse(JSON.stringify(this.workoutWithoutEmptySections.sections));
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
        let max = this.workoutWithoutEmptySections.sections[currentSection].complexes[complex].units[unit].max;
        if (max == null) this.workoutWithoutEmptySections.sections[currentSection].complexes[complex].units[unit].max = 0;
        this.workoutWithoutEmptySections.sections[currentSection].complexes[complex].units[unit].max++;
      },
      subtractMax({ unit, complex }) {
        const currentSection = this.currentSection[this.currentWorkout];
        let max = this.workoutWithoutEmptySections.sections[currentSection].complexes[complex].units[unit].max;
        if (max == null) this.workoutWithoutEmptySections.sections[currentSection].complexes[complex].units[unit].max = 0;
        this.workoutWithoutEmptySections.sections[currentSection].complexes[complex].units[unit].max--;
      }, 
      uploadWorkout() {
        let input = {
          where: {
            id: this.workoutWithoutEmptySections.id,
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
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.name != 'exercises-id') {
          vm.clearAssistantState();
        }
      });
    },
    async beforeRouteLeave(to, from, next) {
      // if trying to leave straight from assistant, ask for permission
      if (this.showWorkoutAssistant) {
        if (await this.$root.$confirm('Czy na pewno chcesz wyjść z tego treningu?')) {
          this.toggleWorkoutAssistant();
        } else {
          return
        }
      }
      next();
    }
  }
</script>

