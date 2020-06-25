<template>
  <div class="exercise-editor">
    <BaseHeader v-if="edit">
      Edytuj ćwiczenie
    </BaseHeader>
    <BaseHeader v-else>
      Nowe ćwiczenie
    </BaseHeader>
    <p>
      W aplikacji Piti najlepiej sprawdzają się animacje w formacie .gif o
      przybliżonej rozdzielczości 16:9. Przesłany plik nie może ważyć więcej niż
      10 megabajtów.
    </p>
    <!-- NAZWA I KATEGORIA -->
    <form>
      <BaseInput
        v-model="input.name"
        placeholder="Angielska nazwa"
        :show-status="false"
      />
      <BaseInput
        v-model="input.alias"
        placeholder="Polska nazwa"
        :show-status="false"
      />
      <BaseSelect placeholder="Kategoria" :value="input.family">
        <select v-model="input.family">
          <option v-for="(family, index) in families" :key="index" :value="family">{{ family.name }}</option>
        </select>
      </BaseSelect>
    </form>
    <!-- ZDJĘCIE  -->
    <div
      v-if="!uploadedImage"
      class="image-upload p32 column a-center j-center"
    >
      <span
        v-if="!uploadedImage && !loadingImage"
        class="column j-center a-center"
      >
        <i class="flaticon-plus fs-32" @click="launchFileUpload" />
        <p class="m00 mt05 fs-12">Na razie brak zdjęcia</p>
        <form v-show="false">
          <input ref="input" name="files" type="file" @change="uploadImage" />
        </form>
      </span>
      <span
        v-if="loadingImage"
        class="column j-center a-center"
        style="opacity: 0.5;"
      >
        <i class="flaticon-counterclockwise fs-32 icon--spinning" />
        <p class="m00 mt05 fs-12">Wczytuję...</p>
      </span>
    </div>
    <div v-else class="image column">
      <img :src="uploadedImage.url" alt="exercise image" />
      <button class="button-secondary mt05" type="button" @click="deleteImage">
        Usuń zdjęcie
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
import createExercise from "~/apollo/mutations/createExercise.gql"
import updateExercise from "~/apollo/mutations/updateExercise.gql"
import getSingleFamily from "~/apollo/queries/getSingleFamily.gql"

export default {
  props: {
    exercise: {
      type: Object,
      default: () => {
        return { name: "", alias: "", description: "" }
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
      endpoint:
        process.env.NODE_ENV == "development"
          ? "http://localhost:1337/upload"
          : "https://piti-backend.herokuapp.com/upload",
      loadingImage: false,
      uploadedImage: this.exercise.image || null,
      input: {
        name: this.exercise.name,
        alias: this.exercise.alias,
        family: null,
      },
      oldFamily: this.$route.params.id
    }
  },
  methods: {
    setFamily() {
      const currentFamiy = this.families.find(family => family.id == this.$route.params.id)
      this.input.family = currentFamiy
    },
    launchFileUpload() {
      this.$refs.input.click()
    },
    uploadImage() {
      this.loadingImage = true
      const formData = new FormData()
      formData.append("files", this.$refs.input.files[0])
      fetch(this.endpoint, {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          res.json().then((data) => {
            this.uploadedImage = data[0]
            this.loadingImage = false
          })
        })
        .catch(() => {
          this.loadingImage = false
          this.$store.commit(
            "main/setNotification",
            "Nie udało się załadować pliku. Upewnij się, że wybrany plik nie waży więcej niż 10MB."
          )
        })
    },
    deleteImage() {
      this.uploadedImage = null
    },
    createExercise() {
      if (this.uploadedImage) this.input.image = this.uploadedImage.id
      this.input.family = this.input.family.id
      const input = {
        data: this.input,
      }
      this.client
        .mutate({
          mutation: createExercise,
          variables: { input },
          update: (cache, { data: { createExercise } }) => {
            // read data from cache for this query
            const data = cache.readQuery({ query: getSingleFamily, variables: { id: this.input.family } })
            // push new item to cache
            data.family.exercises.push(createExercise.exercise)
            // write data back to the cache
            this.client.writeQuery({ query: getSingleFamily, data, variables: { id: this.input.family } })
          },
        })
        .then(() => {
          this.$router.go(-1)
        })
    },
    async updateExercise() {
      if (this.uploadedImage) this.input.image = this.uploadedImage.id
      this.input.family = this.input.family.id
      const input = {
        where: { id: this.exercise.id },
        data: this.input,
      }

      try {
        await this.client.mutate({
          mutation: updateExercise,
          variables: { input },
          update: (cache, { data: { updateExercise } }) => {
            if (this.oldFamily != this.input.family) {
              const { family: oldFamily } = cache.readQuery({ query: getSingleFamily, variables: { id: this.oldFamily } })
              const { family: newFamily } = cache.readQuery({ query: getSingleFamily, variables: { id: this.input.family } })

              const exerciseIndex = oldFamily.exercises.findIndex(exercise => exercise.id == updateExercise.exercise.id)
              oldFamily.exercises.splice(exerciseIndex, 1)
              newFamily.exercises.push(updateExercise.exercise)
              
              cache.writeQuery({ query: getSingleFamily, variables: { id: this.oldFamily }, data: oldFamily })
              cache.writeQuery({ query: getSingleFamily, variables: { id: this.input.family }, data: newFamily })
            }
          },
        })
        this.$router.go(-1)
      } catch {
        const message = 'Nie udało się edytować ćwiczenia. Sprawdź połączenie z Internetem'
        
        this.$store.commit(
          "main/setNotification",
          message
        )
      }
      
    },
  },
  mounted() {
    this.setFamily()
  }
}
</script>

<style lang="scss" scoped>
.exercise-editor {
  background-size: cover;
  background-position: center;
  transition: background-image 0.3s;
}

.image-upload {
  border: 1px solid color(faded);
  color: color(faded);
  border-radius: 6px;
  margin-top: 2rem;
  margin-bottom: 0;
}

img {
  width: 100%;
}

.buttons button {
  width: 49%;
}
</style>
