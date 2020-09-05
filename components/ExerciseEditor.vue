<template>
  <div class="exercise-editor">
    <BaseHeader v-if="edit"> Edytuj ćwiczenie </BaseHeader>
    <BaseHeader v-else> Nowe ćwiczenie </BaseHeader>
    <p v-if="!edit">
      Dodaj nazwę, kategorię oraz wideo poglądowe nowego ćwiczenia. Aplikacja
      Piti akceptuje tylko filmy w formacie mp4, w preferowanej rozdzielczości
      16:9.
    </p>
    <p v-else>
      Edytuj nazwę, kategorię oraz wideo poglądowe swojego ćwiczenia. Aplikacja
      Piti akceptuje tylko filmy w formacie mp4, w preferowanej rozdzielczości
      16:9.
    </p>
    <!-- NAZWA I KATEGORIA -->
    <form>
      <BaseInput
        v-model="input.name"
        placeholder="Nazwa ćwiczenia"
        :show-status="false"
      />
      <BaseSelect placeholder="Kategoria ćwiczenia" :value="input.family">
        <select v-model="input.family">
          <option
            v-for="(family, index) in families"
            :key="index"
            :value="family"
          >
            {{ family.name }}
          </option>
        </select>
      </BaseSelect>
    </form>
    <!-- ZDJĘCIE  -->
    <div
      v-if="!uploadedImage"
      class="video-upload p32 column a-center j-center"
    >
      <span
        v-if="!uploadedImage && !loadingImage"
        class="column j-center a-center"
      >
        <i class="flaticon-plus fs-32" @click="launchFileUpload" />
        <p class="m00 mt05 fs-12">Na razie brak filmu</p>
        <form v-show="false">
          <input
            ref="input"
            name="image"
            type="file"
            @change="uploadImage"
            accept=".mp4"
          />
        </form>
      </span>
      <span
        v-if="loadingImage"
        class="column j-center a-center"
        style="opacity: 0.5"
      >
        <i class="flaticon-counterclockwise fs-32 icon--spinning" />
        <p class="m00 mt05 fs-12">Wczytuję...</p>
      </span>
    </div>
    <div v-else class="video column">
      <video autoplay loop muted playsinline>
        <source :src="video" type="video/webm" />
        <source :src="video" type="video/mp4" />
      </video>
      <button class="button-secondary mt05" type="button" @click="deleteImage">
        Usuń film
      </button>
    </div>
    <!-- BUTTONY ZAPISZ ODRZUĆ  -->
    <div class="buttons row j-between mt2">
      <button
        v-if="exercise.id == null"
        class="button-primary"
        type="button"
        @click="createExercise"
      >
        Zapisz
      </button>
      <button
        v-else
        class="button-primary"
        type="button"
        @click="updateExercise"
      >
        Zapisz
      </button>
      <button class="button-primary" type="button" @click="$router.go(-1)">
        Anuluj
      </button>
    </div>
  </div>
</template>

<script>
import createExercise from "~/apollo/mutations/createExercise.gql";
import updateExercise from "~/apollo/mutations/updateExercise.gql";
import getSingleFamily from "~/apollo/queries/getSingleFamily.gql";
import getAllFamilies from "~/apollo/queries/getAllFamilies.gql";

export default {
  props: {
    exercise: {
      type: Object,
      default: () => {
        return { name: "" };
      },
    },
    families: {
      type: Array,
      required: true,
    },
    edit: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      client: this.$apollo.getClient(),
      loadingImage: false,
      uploadedImage: this.exercise.image || null,
      input: {
        name: this.exercise.name,
        family: null,
      },
      oldFamily: this.$route.params.id,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
    video() {
      if (this.uploadedImage) {
        const link = this.uploadedImage.url.replace(".gif", ".mp4");
        return link;
      } else {
        return null;
      }
    },
  },
  methods: {
    setFamily() {
      const currentFamiy = this.families.find(
        (family) => family.id == this.$route.params.id
      );
      this.input.family = currentFamiy;
    },
    launchFileUpload() {
      this.$refs.input.click();
    },
    uploadImage() {
      const file = this.$refs.input.files[0];
      if (file.type != "video/mp4") {
        const message =
          "W tym miejscu możesz załączyć jedynie film w formacie mp4.";
        this.$store.commit("main/setNotification", message);
        return;
      }
      this.loadingImage = true;
      const formData = new FormData();
      formData.append("image", file);
      fetch(`${process.env.endpoint}/api/upload-file`, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          this.uploadedImage = data;
          this.loadingImage = false;
        })
        .catch(() => {
          this.loadingImage = false;
          this.$store.commit(
            "main/setNotification",
            "Nie udało się załadować pliku. Upewnij się, że wybrany plik nie waży więcej niż 10MB."
          );
        });
    },
    deleteImage() {
      fetch(`${process.env.endpoint}/api/delete-file`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.uploadedImage),
      });
      this.uploadedImage = null;
    },
    updateFamilyCache(operationType, cache, variables, editedExercise) {
      const { family } = cache.readQuery({
        query: getSingleFamily,
        variables,
      });

      if (operationType === "add") {
        family.exercises.push(editedExercise);
      } else if (operationType === "delete") {
        const exerciseIndex = family.exercises.findIndex(
          (exercise) => exercise.id == editedExercise.id
        );

        family.exercises.splice(exerciseIndex, 1);
      }

      this.client.writeQuery({
        query: getSingleFamily,
        data: family,
        variables,
      });
    },
    updateFamiliesCache(cache, editedExercise, operation) {
      const { families } = cache.readQuery({
        query: getAllFamilies,
        variables: { userId: this.user.id },
      });

      if (operation === "remove" || operation === "add/remove") {
        const oldFamilyIndex = families.findIndex(
          (family) => family.id === this.oldFamily
        );

        const exerciseIndex = families[
          oldFamilyIndex
        ].exercises.findIndex(
          (exercise) => exercise.id == editedExercise.id
        );

        families[oldFamilyIndex].exercises.splice(exerciseIndex, 1);
      }

      if (operation === "add" || operation === "add/remove") {
        const newFamilyIndex = families.findIndex(
          (family) => family.id === this.input.family
        );

        families[newFamilyIndex].exercises.push(editedExercise);
      }

      cache.writeQuery({
        query: getAllFamilies,
        variables: { userId: this.user.id },
        data: families,
      });
    },
    createExercise() {
      if (this.uploadedImage) this.input.image = this.uploadedImage._id;
      this.input.family = this.input.family.id;

      this.client
        .mutate({
          mutation: createExercise,
          variables: { input: this.input },
          update: (cache, { data: { createExercise } }) => {
            if (cache.data.data.ROOT_QUERY)
              if (cache.data.data.ROOT_QUERY[`family({"id":"${this.input.family}"})`]) {
                this.updateFamilyCache(
                  "add",
                  cache,
                  { id: this.input.family },
                  createExercise
                );
              }

              if (cache.data.data.ROOT_QUERY[`families({"userId":"${this.user.id}"})`]) {
                this.updateFamiliesCache(cache, createExercise, "add")
              }
          }
        })
        .then(() => {
          this.$router.go(-1);
        })
        .catch(() => {
          const message =
            "Nie udało się stworzyć ćwiczenia. Sprawdź połączenie z Internetem";
          this.$store.commit("main/setNotification", message);
        });
    },
    async updateExercise() {
      if (this.uploadedImage) this.input.image = this.uploadedImage._id;
      this.input.family = this.input.family.id;
      this.input.id = this.exercise.id;

      try {
        await this.client.mutate({
          mutation: updateExercise,
          variables: { input: this.input },
          update: (cache, { data: { updateExercise } }) => {
            if (
              this.oldFamily != this.input.family &&
              cache.data.data.ROOT_QUERY
            ) {
              if (
                cache.data.data.ROOT_QUERY[
                  `families({"userId":"${this.user.id}"})`
                ]
              ) {
                this.updateFamiliesCache(cache, updateExercise, "add/remove")
              }
              // update two involved families
              if (
                cache.data.data.ROOT_QUERY[`family({"id":"${this.oldFamily}"})`]
              ) {
                this.updateFamilyCache(
                  "delete",
                  cache,
                  { id: this.oldFamily },
                  updateExercise
                );
              }

              if (
                cache.data.data.ROOT_QUERY[
                  `family({"id":"${this.input.family}"})`
                ]
              ) {
                this.updateFamilyCache(
                  "add",
                  cache,
                  { id: this.input.family },
                  updateExercise
                );
              }
            }
          },
        });
        this.$router.go(-1);
      } catch {
        const message =
          "Nie udało się edytować ćwiczenia. Sprawdź połączenie z Internetem";

        this.$store.commit("main/setNotification", message);
      }
    },
  },
  mounted() {
    this.setFamily();
  },
};
</script>

<style lang="scss" scoped>
.exercise-editor {
  background-size: cover;
  background-position: center;
  transition: background-image 0.3s;
}

.video-upload {
  border: 1px solid color(faded);
  color: color(faded);
  border-radius: 6px;
  margin-top: 2rem;
  margin-bottom: 0;
}

video {
  object-fit: cover;
  width: 100%;
}

.buttons button {
  width: 49%;
}
</style>
