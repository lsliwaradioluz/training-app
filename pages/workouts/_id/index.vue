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
          :workout="workoutWithoutEmptySections"
          @show-assistant="toggleWorkoutAssistant"
          @edit-feedback="editingFeedback = true"
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
              v-for="section in workoutWithoutEmptySections.sections"
              :key="section.id"
              class="p11 column"
            >
              <Routine :section="section">
                <template v-slot:unit-buttons="{ unit }">
                  <nuxt-link
                    class="flaticon-right-arrow t-faded"
                    :to="`/exercises/${unit.exercise.id}`"
                  />
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
          @set-current-section="
            setCurrentSection({ index: currentWorkout, section: $event })
          "
          @edit-feedback="editingFeedback = true"
        />
      </Carousel>
      <Modal :show="editingFeedback" @close="editingFeedback = false">
        <FeedbackEditor
          :feedback="workouts[currentWorkout].feedback"
          @feedback-edited="saveFeedback($event)"
          @close="editingFeedback = false"
        />
      </Modal>
    </div>
    <Placeholder v-else />
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import mainQuery from "~/apollo/queries/workouts/_id/main.gql";
import updateWorkout from "~/apollo/mutations/updateWorkout.gql";

export default {
  apollo: {
    workouts: {
      query: mainQuery,
      variables() {
        let IDs;
        if (this.$store.state.main.workoutToPair) {
          IDs = [
            this.$route.params.id,
            this.$store.state.main.workoutToPair.id,
          ];
        } else {
          IDs = [this.$route.params.id];
        }
        return {
          ids: IDs,
        };
      },
    },
  },
  data() {
    return {
      client: this.$apollo.getClient(),
      editingFeedback: false,
    };
  },
  computed: {
    ...mapGetters({
      showWorkoutAssistant: "assistant/showWorkoutAssistant",
      currentWorkout: "assistant/currentWorkout",
      currentSection: "assistant/currentSection",
    }),
    workoutWithoutEmptySections() {
      const workout = this.workouts[this.currentWorkout];
      workout.sections = workout.sections.filter((section) => {
        return section.complexes.length > 0;
      });
      return workout;
    },
    users() {
      let users = [];
      this.workouts.forEach((cur) => {
        users.push(cur.user.username);
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
  },
  methods: {
    ...mapMutations({
      setCurrentWorkout: "assistant/setCurrentWorkout",
      toggleWorkoutAssistant: "assistant/toggleWorkoutAssistant",
      clearAssistantState: "assistant/clearAssistantState",
      setCurrentSection: "assistant/setCurrentSection",
      setNotification: "main/setNotification",
    }),
    async saveFeedback(feedback) {
      this.workouts[this.currentWorkout].feedback = feedback;
      this.editingFeedback = false;
      let input = {
        where: { id: this.workoutWithoutEmptySections.id },
        data: { feedback },
      };
      try {
        await this.client.mutate({
          mutation: updateWorkout,
          variables: { input: input },
        });
      } catch (err) {
        this.setNotification(
          "Nie udało się zapisać notatki. Sprawdź połączenie z Internetem"
        );
      }
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
