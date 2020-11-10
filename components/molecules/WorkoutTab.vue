<template>
  <div class="workout-tab" :class="{ sticky: workout.sticky }">
    <nuxt-link
      class="link"
      tag="button"
      :to="workout.ready ? `/workouts/${this.workout.id}` : ``"
      @click.native="showNotification(workout.ready)"
    >
      <template v-if="!workout.sticky">
        <Header>{{ workout.scheduled | reverseDate }}</Header>
        <Caption>
          {{ workout.scheduled | getDayName }} {{ workout.scheduled | getTime }}
        </Caption>
      </template>
      <template v-else>
        <Header>
          {{ workout.name ? workout.name : "Podwieszony" }}
        </Header>
        <Caption> dodano {{ workout.createdAt | reverseDate }} </Caption>
      </template>
    </nuxt-link>
    <Icon
      v-if="!$route.path.includes('users')"
      name="right-arrow"
      :color="workout.ready ? '#FDDCBD' : '#6b6d84'"
    />
    <ContextMenu bottom v-else>
      <template v-slot:trigger>
        <Icon name="vertical-dots" />
      </template>
      <template v-slot:options>
        <button
          v-for="(button, index) in buttons"
          :key="index"
          :class="`flaticon-${button.icon}`"
          @click="button.cb"
        >
          {{ button.caption }}
        </button>
      </template>
    </ContextMenu>
  </div>
</template>

<script>
import Header from "../atoms/TabHeader";
import Caption from "../atoms/TabCaption";
import Icon from "../atoms/TabIcon";

import deleteWorkout from "~/apollo/mutations/deleteWorkout.gql";
import getSingleUser from "~/apollo/queries/getSingleUser.gql";

export default {
  components: { Header, Caption, Icon },
  props: {
    workout: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      client: this.$apollo.getClient(),
    };
  },
  computed: {
    buttons() {
      const buttons = [
        { icon: "pencil", caption: "Edytuj", cb: this.editWorkout },
        { icon: "trash", caption: "Usuń", cb: this.deleteWorkout },
      ];

      if (this.workout.ready) {
        const additionalButtonsIndex = buttons.length - 1;
        const additionalButtons = [
          { icon: "copy", caption: "Kopiuj", cb: this.copyWorkout },
          {
            icon: "double-arrow-cross-of-shuffle",
            caption: "Paruj",
            cb: this.pairWorkout,
          },
        ];
        buttons.splice(additionalButtonsIndex, 0, ...additionalButtons);
      }

      return buttons;
    },
  },
  methods: {
    editWorkout() {
      this.$router.push({
        path: `/workouts/${this.workout.id}/edit`,
        query: { user: this.user.id },
      });
    },
    copyWorkout() {
      this.workout.user = {
        id: this.user.id,
        username: this.user.username,
        fullname: this.user.fullname,
      };
      this.workout.type = "workoutToCopy";
      if (this.$store.state.main.workoutToCopy) {
        this.$store.dispatch("main/updateEntryInDb", this.workout);
      } else {
        this.$store.dispatch("main/addEntryToDb", this.workout);
      }

      this.$router.push("/users");
    },
    pairWorkout() {
      this.workout.user = {
        id: this.user.id,
        username: this.user.username,
        fullname: this.user.fullname,
      };
      this.workout.type = "workoutToPair";
      if (this.$store.state.main.workoutToPair) {
        this.$store.dispatch("main/updateEntryInDb", this.workout);
      } else {
        this.$store.dispatch("main/addEntryToDb", this.workout);
      }
      this.$router.push("/users");
    },
    async deleteWorkout() {
      if (
        await this.$root.$confirm("Czy na pewno chcesz usunąć ten element?")
      ) {
        this.client.mutate({
          mutation: deleteWorkout,
          variables: {
            id: this.workout.id,
          },
          update: (cache, { data: { deleteWorkout } }) => {
            // read data from cache for chosen queries
            const data = cache.readQuery({
              query: getSingleUser,
              variables: { id: this.$route.params.id },
            });
            // find index of deleted item in cached user.workouts array
            const workoutIndex = data.user.workouts.findIndex(
              (workout) => workout.id == deleteWorkout.id
            );
            // remove deleted item from data
            data.user.workouts.splice(workoutIndex, 1);
            //write data back to cache
            this.client.writeQuery({ query: getSingleUser, data });
          },
        });
      }
    },
    showNotification(isWorkoutReady) {
      if (!isWorkoutReady) {
        this.$store.commit(
          "main/setNotification",
          "Ten trening nie ma jeszcze rozpiski"
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.workout-tab {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.link {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  padding-right: 1rem;
  text-align: left;
}
</style>
