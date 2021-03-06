<template>
  <div>
    <div v-if="!$apollo.loading" class="workout">
      <div v-show="!showWorkoutAssistant">
        <button
          type="button"
          @click="setCurrentWorkout(currentWorkout == 0 ? 1 : 0)"
        >
          <h5 class="m00 t-white">
            {{ currentWorkout == 0 ? users[1] : users[0] }}
          </h5>
        </button>
        <WorkoutPanel
          :workout="workouts[currentWorkout]"
          @show-assistant="toggleWorkoutAssistant"
        />
        <div class="carousel-container b-secondary">
          <Carousel
            :key="`${showWorkoutAssistant}${currentWorkout}`"
            :navigation-config="{
              height: '2px',
              margin: '0',
              borderRadius: '0',
              activeColor: '#FDDCBD',
              fullWidth: true,
            }"
            :start-from-page="currentSection[currentWorkout]"
            @change-page="
              setCurrentSection({ index: currentWorkout, section: $event })
            "
          >
            <div
              v-for="section in workouts[currentWorkout].sections"
              :key="section.id"
              class="p11 column"
            >
              <Routine :section="section">
                <template v-slot:unit-buttons="{ unit }">
                  <ContextMenu>
                    <template v-slot:trigger>
                      <span class="flaticon-vertical-dots fs-12" />
                    </template>
                    <template v-slot:options>
                      <nuxt-link
                        v-if="unit.exercise.image"
                        class="flaticon-gymnast"
                        tag="button"
                        type="button"
                        :to="`/exercises/${unit.exercise.family.id}?exercise=${unit.exercise.id}`"
                      >
                        Zobacz ćwiczenie 
                      </nuxt-link>
                      <button class="flaticon-pencil" type="button" @click="openFeedbackEditor(unit)">
                        Dodaj notatkę
                      </button>
                    </template>
                  </ContextMenu>
                </template>
              </Routine>
            </div>
          </Carousel>
        </div>
      </div>
      <!-- ASYSTENT -->
      <Carousel
        v-show="showWorkoutAssistant"
        :navigation-config="carouselNavConfig"
        :start-from-page="currentWorkout"
        @change-page="setCurrentWorkout($event)"
      >
        <WorkoutAssistant
          v-for="(workout, index) in workouts"
          :key="workout.id"
          :workout="workout"
          :workout-index="index"
          :section-index="currentSection[index]"
          :is-screen-divided="workouts.length > 1"
          @set-current-section="setCurrentSection({ index: currentWorkout, section: $event })"
          @edit-feedback="openFeedbackEditor($event)"
        />
      </Carousel>
      <Modal :show="!!editedUnit" @close="editedUnit = null">
        <FeedbackEditor
          :unit="editedUnit"
          @feedback-edited="saveFeedback($event)"
          @close="editedUnit = null"
        />
      </Modal>
    </div>
    <Placeholder v-else />
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import getSingleWorkout from "~/apollo/queries/getSingleWorkout.gql";
import updateWorkout from "~/apollo/mutations/updateWorkout.gql";

export default {
  apollo: {
    workout: {
      query: getSingleWorkout,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
    },
  },
  data() {
    return {
      client: this.$apollo.getClient(),
      editedUnit: null,
    };
  },
  computed: {
    ...mapState('assistant', [
      'showWorkoutAssistant',
      'currentWorkout',
      'currentSection',
    ]),
    workouts() {
      const workouts = [this.workout]
      const workoutToPair = this.$store.state.main.workoutToPair
      if (workoutToPair) {
        workouts.push(workoutToPair)
      }
      return workouts
    },
    users() {
      let users = [];
      this.workouts.forEach((workout) => {
        users.push(workout.user.username);
      });
      return users;
    },
    carouselNavConfig() {
      return {
        height: "2px",
        margin: "0",
        borderRadius: "0",
        activeColor: "#FDDCBD",
        fullWidth: true,
      };
    },
    filteredSections() {
      const sectionsClone = JSON.parse(JSON.stringify(this.workouts[this.currentWorkout].sections))
      //level one
      sectionsClone.forEach((section, sectionindex) => {
        sectionsClone[sectionindex] = _.omit(section, "__typename", "id")
        // level two
        section.complexes.forEach((complex, complexindex) => {
          sectionsClone[sectionindex].complexes[complexindex] = _.omit(
            complex,
            "__typename",
            "id"
          )
          complex.units.forEach((unit, unitindex) => {
            sectionsClone[sectionindex].complexes[complexindex].units[
              unitindex
            ] = _.omit(unit, "__typename", "id")
            sectionsClone[sectionindex].complexes[complexindex].units[
              unitindex
            ].exercise = unit.exercise.id
          })
        })
      })

      return sectionsClone
    },
  },
  methods: {
    ...mapMutations({
      setCurrentWorkout: "assistant/setCurrentWorkout",
      toggleWorkoutAssistant: "assistant/toggleWorkoutAssistant",
      clearAssistantState: "assistant/clearAssistantState",
      setCurrentSection: "assistant/setCurrentSection",
      setNotification: "main/setNotification",
    }),
    openFeedbackEditor(unit) {
      this.editedUnit = unit
    },
    async saveFeedback(newFeedback) {
      const oldFeedback = this.editedUnit.feedback
      this.editedUnit.feedback = newFeedback
      
      let input = {
        id: this.workouts[this.currentWorkout].id,
        sections: this.filteredSections,
      };
      try {
        this.$nuxt.$loading.start()
        await this.client.mutate({
          mutation: updateWorkout,
          variables: { input },
        });
        this.setNotification(
          "Notatka zapisana pomyślnie!"
        );
      } catch (err) {
        this.editedUnit.feedback = oldFeedback
        this.setNotification(
          "Nie udało się zapisać notatki. Sprawdź połączenie z Internetem"
        );
      }
      this.editedUnit = null
      this.$nuxt.$loading.finish()
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name != "exercises-id") {
        vm.clearAssistantState();
      }
    });
  },
  async beforeRouteLeave(to, from, next) {
    // if trying to leave straight from assistant, ask for permission
    if (this.showWorkoutAssistant) {
      if (
        await this.$root.$confirm("Czy na pewno chcesz wyjść z tego treningu?")
      ) {
        this.toggleWorkoutAssistant();
      } else {
        return;
      }
    }
    next();
  },
};
</script>
