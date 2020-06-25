<template>
  <div class="family" v-if="!$apollo.loading">
    <article class="family__exercise" :style="{ backgroundImage }">
      <h3 class="family__exercise__name" v-if="currentExercise">
        {{ currentExercise.name }}
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
            <button class="flaticon-trash" type="button" @click="deleteFamily">
              Usuń kategorię
            </button>
          </template>
        </ContextMenu>
      </h3>
      <p class="family__details__alias">
        {{ family.alias }}
      </p>
      <ul class="family__details__exercises" v-if="family.exercises.length > 0">
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
    <!-- <article class="family__description">
      <p>
        {{ family.description }}
      </p>
    </article> -->
  </div>
  <Placeholder v-else />
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
      return this.$store.getters["auth/user"];
    },
    currentExercise() {
      return this.family.exercises[this.current];
    },
    backgroundImage() {
      if (this.currentExercise && this.currentExercise.image) {
        return `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${this.currentExercise.image.url}')`;
      } else {
        return `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://media.giphy.com/media/fdlcvptCs4qsM/giphy.gif')`;
      }
    },
  },
  methods: {
    async deleteExercise() {
      if (await this.$root.$confirm("Na pewno chcesz usunąć to ćwiczenie?")) {
        const input = {
          where: {
            id: this.currentExercise.id,
          },
        };

        this.client.mutate({
          mutation: deleteExercise,
          variables: { input },
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
              (exercise) => exercise.id == deleteExercise.exercise.id
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
        const input = {
          where: {
            id: this.family.id,
          },
        };

        this.client.mutate({
          mutation: deleteFamily,
          variables: { input },
          update: (cache, { data: { deleteFamily } }) => {
            this.$router.push("/exercises");
            // read data from cache for this query
            const data = cache.readQuery({ query: getAllFamilies });
            // find index of deleted item in cached user.workouts array
            const familyIndex = data.families.findIndex(
              (family) => family.id == deleteFamily.family.id
            );
            // remove deleted item from cache
            data.families.splice(familyIndex, 1);
            // write data back to the cache
            cache.writeQuery({ query: getAllFamilies, data });
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
  display: flex;
  flex-direction: column;
}

.family__exercise {
  background-size: cover;
  background-position: center;
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
}

.family__details {
  padding: 1rem;
}

.family__details__name {
  margin: 0;
  display: flex;
  justify-content: space-between;
}

.family__details__alias {
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
}

.family__details__exercise--active {
  background-color: color(headers);
  border-color: color(headers);
  color: color(primary);
}

.family__description {
  padding: 0 1rem 1rem 1rem;
}
</style>
