<template>
  <div class="family" v-if="!$apollo.loading">
    <div class="family__main">
      <article class="family__exercise">
        <Video :key="`image-${current}${family.exercises.length}`" :source="video" opacity="0.2" />
        <h3 class="family__exercise__name" v-if="currentExercise">
          <MovingText :key="current">
            {{ currentExercise.name }}
          </MovingText>
          <ContextMenu v-if="user.admin">
            <template v-slot:trigger>
              <i class="flaticon-vertical-dots" />
            </template>
            <template v-slot:options>
              <nuxt-link
                class="flaticon-pencil mr05"
                tag="button"
                type="button"
                :to="`edit-exercise?exercise=${currentExercise.id}`"
                append
              >
                Edytuj ćwiczenie
              </nuxt-link>
              <button
                class="flaticon-trash fs-09 mr05"
                type="button"
                @click="deleteExercise"
              >
                Usuń ćwiczenie
              </button>
            </template>
          </ContextMenu>
        </h3>
      </article>
      <article class="family__details">
        <h3 class="family__details__name">
          {{ family.name }}
          <ContextMenu v-if="user.admin" bottom>
            <template v-slot:trigger>
              <i class="flaticon-vertical-dots" />
            </template>
            <template v-slot:options>
              <nuxt-link
                class="flaticon-add-button"
                tag="button"
                type="button"
                to="new-exercise"
                append
              >
                Dodaj ćwiczenie
              </nuxt-link>
              <nuxt-link
                class="flaticon-pencil"
                tag="button"
                type="button"
                to="edit-family"
                append
              >
                Edytuj kategorię
              </nuxt-link>
              <button
                class="flaticon-trash"
                type="button"
                @click="deleteFamily"
              >
                Usuń kategorię
              </button>
            </template>
          </ContextMenu>
        </h3>
        <p class="family__details__caption">
          {{ familyCaption }}
        </p>
        <ul
          class="family__details__exercises"
          v-if="family.exercises.length > 0"
        >
          <li
            class="family__details__exercise"
            :class="{ 'family__details__exercise--active': index == current }"
            v-for="(exercise, index) in family.exercises"
            :key="exercise.id"
            @click="current = index"
          >
            {{ index + 1 }}
          </li>
        </ul>
        <p class="mb0 mt05" v-else>
          Ta kategoria nie ma jeszcze żadnego ćwiczenia
        </p>
      </article>
    </div>
  </div>
  <Placeholder padding v-else />
</template>

<script>
import getSingleFamily from "~/apollo/queries/getSingleFamily.gql";
import getAllFamilies from "~/apollo/queries/getAllFamilies.gql";
import deleteExercise from "~/apollo/mutations/deleteExercise.gql";
import deleteFamily from "~/apollo/mutations/deleteFamily.gql";

export default {
  layout: "exercise",
  apollo: {
    family: {
      query: getSingleFamily,
      variables() {
        return {
          id: this.$route.params.id,
        };
      },
      manual: true,
      result({ data, loading }) {
        if (!loading) {
          this.family = data.family;
          if (this.$route.query.exercise) {
            const exerciseIndex = this.family.exercises.findIndex(
              (exercise) => exercise.id === this.$route.query.exercise
            );
            this.current = exerciseIndex;
          }
        }
      },
    },
  },
  data() {
    return {
      family: {},
      client: this.$apollo.getClient(),
      current: 0,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    currentExercise() {
      return this.family.exercises[this.current];
    },
    video() {
      if (this.currentExercise && this.currentExercise.image) {
        return this.currentExercise.image.url
      } else {
        return "https://res.cloudinary.com/drsgb4wld/image/upload/v1594649581/GIF-200713_160448_03e89fc155.mp4";
      }
    },
    familyCaption() {
      let exerciseDeclination;
      const numberOfExercises = this.family.exercises.length;

      if (numberOfExercises == 1) {
        exerciseDeclination = "ćwiczenie";
      } else if ([2, 3, 4].includes(numberOfExercises)) {
        exerciseDeclination = "ćwiczenia";
      } else {
        exerciseDeclination = "ćwiczeń";
      }

      return `Kategoria | ${numberOfExercises} ${exerciseDeclination}`;
    },
  },
  methods: {
    async deleteExercise() {
      if (await this.$root.$confirm("Na pewno chcesz usunąć to ćwiczenie?")) {
        const deletedExercise = await this.client.mutate({
          mutation: deleteExercise,
          variables: { id: this.currentExercise.id },
          update: (cache, { data: { deleteExercise } }) => {
            if (this.current == this.family.exercises.length - 1) {
              this.current -= 1;
            }
            // read data from cache for this query
            const data = cache.readQuery({
              query: getSingleFamily,
              variables: { id: this.family.id },
            });
            // find index of deleted item in cached user.workouts array
            const exerciseIndex = data.family.exercises.findIndex(
              (exercise) => exercise.id == deleteExercise.id
            );
            // remove deleted item from cache
            data.family.exercises.splice(exerciseIndex, 1);
            // write data back to the cache
            cache.writeQuery({
              query: getSingleFamily,
              variables: { id: this.family.id },
              data,
            });
          },
        });

        if (deletedExercise.data.deleteExercise.image) {
          const file = deletedExercise.data.deleteExercise.image;
          fetch(`${process.env.endpoint}/api/delete-file`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(file),
          });
        }
      }
    },
    async deleteFamily() {
      if (this.family.exercises.length > 0) {
        const message =
          "Usunięcie kategorii jest możliwe tylko wtedy, gdy nie zawiera żadnych ćwiczeń";
        this.$store.commit("main/setNotification", message);
        return;
      }

      if (await this.$root.$confirm("Na pewno chcesz usunąć tę kategorię?")) {
        this.client.mutate({
          mutation: deleteFamily,
          variables: { id: this.family.id },
          update: (cache, { data: { deleteFamily } }) => {
            this.$router.push("/exercises");
            // Check if cache for this query exists
            if (
              !cache.data.data.ROOT_QUERY[
                `families({"userId":"${this.user.id}"})`
              ]
            ) {
              return;
            }
            // read data from cache for this query
            const data = cache.readQuery({
              query: getAllFamilies,
              variables: { userId: this.user.id },
            });
            // find index of deleted item in cached user.workouts array
            const familyIndex = data.families.findIndex(
              (family) => family.id == deleteFamily.id
            );
            // remove deleted item from cache
            data.families.splice(familyIndex, 1);
            // write data back to the cache
            cache.writeQuery({
              query: getAllFamilies,
              variables: { userId: this.user.id },
              data,
            });
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.family {
  height: 100vh;
}

.family__main {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.family__exercise {
  position: relative;
  flex-basis: 90%;
  flex-shrink: 1;
  border-bottom: 2px solid color(headers);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
}

.family__exercise__name {
  color: white !important;
  margin: 0;
  display: flex;
  justify-content: space-between;
  z-index: 4;
}

.family__details {
  padding: 1rem;
}

.family__details__name {
  margin: 0;
  display: flex;
  justify-content: space-between;
}

.family__details__button {
  display: flex;
  align-items: center;
  animation: pulse 1s infinite;
}

.family__details__caption {
  margin: 0;
  color: color(faded);
  font-size: 12px;
}

.family__details__exercises {
  display: flex;
  flex-wrap: wrap;
  padding-top: 0.5rem;
}

.family__details__exercise {
  height: 25px;
  width: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 50%;
  border: 1px solid white;
  margin-right: 5px;
  margin-bottom: 5px;
  transition: background-color 0.3s;
  font-size: 13px;
}

.family__details__exercise--active {
  background-color: color(headers);
  border-color: color(headers);
  color: color(primary);
}
</style>
