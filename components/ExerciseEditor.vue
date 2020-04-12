<template>
  <div class="exercise-editor main" :style="{ backgroundImage: uploadedImage ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${uploadedImage.url}')` : 'none' }">
    <p>Uzupełnij nazwy, opis oraz animację swojego ćwiczenia. W aplikacji Piti najlepiej sprawdzają się animacje w formacie .gif o rozdzielczości 16:9.</p>
    <h3 class="mb0" v-if="!edit">Nowe ćwiczenie</h3>
  <!-- NAZWA  -->
    <form>
      <CustomInput 
        v-model="input.name"
        placeholder="Angielska nazwa"
        :show-status="false"
        icon="check-mark"
        />
      <CustomInput 
        v-model="input.alias"
        placeholder="Polska nazwa"
        :show-status="false"
        icon="check-mark"
        />
    </form>
  <!-- ZDJĘCIE  -->
    <div class="tab mt05 mb05 p32 column a-center j-center">
      <span class="column j-center a-center" v-if="!uploadedImage && !loadingImage">
        <i class="flaticon-plus fs-32" @click="launchFileUpload" />
        <p class="m00 mt05 fs-12">Na razie brak zdjęcia</p>
        <form v-show="false">
          <input
            @change="uploadImage"
            ref="input"
            name="files"
            type="file">
        </form>
      </span>
      <span class="column j-center a-center" style="opacity: 0.5" v-if="loadingImage">
        <i class="flaticon-counterclockwise fs-32 icon--spinning"></i>
        <p class="m00 mt05 fs-12">Wczytuję...</p>
      </span>
      <span class="column j-center a-center" v-if="uploadedImage">
        <i class="flaticon-close fs-32" @click="deleteImage"></i>
        <span class="t-center fs-12">Usuń wybrane zdjęcie</span>
      </span>
    </div>
  <!-- OPIS  -->
    <CustomTextarea
      class="mt1"
      :value="input.description"
      icon="check-mark"
      placeholder="Opis ćwiczenia"
      @type="input.description = $event" />
  <!-- BUTTONY ZAPISZ ODRZUĆ  -->
    <div class="exercise-editor__buttons row j-between">
      <button class="button-primary" type="button" @click="createExercise" v-if="exercise.id == null">Zapisz</button>
      <button class="button-primary" type="button" @click="updateExercise" v-else>Zapisz</button>
      <button class="button-primary" type="button" @click="$router.go(-1)">Anuluj</button>
    </div>
  </div>
</template>

<script>
  import deleteExercise from '~/apollo/mutations/deleteExercise.gql';
  import createExercise from '~/apollo/mutations/createExercise.gql';
  import updateExercise from '~/apollo/mutations/updateExercise.gql';
  import mainQuery from '~/apollo/queries/exercises/main.gql';

  export default {
    props: {
      exercise: {
        type: Object,
        default: () => {
          return { name: '', technique: '' }
        }
      },
      edit: {
        type: Boolean, 
        default: () => false
      }
    },
    data() {
      return {
        audioSource: null,
        client: this.$apollo.getClient(),
        endpoint: process.env.NODE_ENV == 'development' ? 'http://localhost:1337/upload' : 'https://piti-backend.herokuapp.com/upload',
        loadingImage: false,
        uploadedImage: this.exercise.image || null,
        input: {
          name: this.exercise.name,
          alias: this.exercise.alias,
          description: this.exercise.description,
        }
      }
    },
    methods: {
      launchFileUpload() {
        this.$refs.input.click();
      },
      uploadImage() {
        this.loadingImage = true;
        const formData = new FormData();
        formData.append('files', this.$refs.input.files[0]);
        fetch(this.endpoint, {
          method: 'POST', 
          body: formData
        })
        .then(res => {
          res.json().then(data => {
            this.uploadedImage = data[0];
            this.loadingImage = false;
          });
        })
      },
      deleteImage() {
        this.uploadedImage = null;
      },
      createExercise() {
        if (this.uploadedImage) this.input.image = this.uploadedImage.id;
        const input = {
          data: this.input
        }
        this.client.mutate({ 
          mutation: createExercise, 
          variables: { 
            input: input 
          }, 
          update: (cache, { data: { createExercise } }) => {
            // read data from cache for this query
            const data = cache.readQuery({ query: mainQuery });
            // push new item to cache 
            data.exercises.unshift(createExercise.exercise);
            // write data back to the cache
            this.client.writeQuery({ query: mainQuery, data: data });
          }
        })
        .then(res => {
          this.$router.go(-1);
        });
      }, 
      updateExercise() {
        this.input.image = this.uploadedImage && this.uploadedImage.id;
        const input = {
          where: {
            id: this.exercise.id
          },
          data: this.input
        }

        this.client.mutate({ mutation: updateExercise, variables: { input: input } })
          .then(res => {
            this.$router.go(-1);
          });
      },
    },
  }
</script>

<style lang="scss" scoped>

  .exercise-editor {
    min-height: 100vh;
    background-size: cover;
    background-position: center;
    transition: background-image 0.3s;
  }

  .tab {
    border-radius: 6px;
    border: 1px solid #74B9F5; 
    color: #74B9F5;
  }

  .exercise-editor__image {
    height: 90%;
    img {
      border-radius: 5px;
      width: 100%;
    }
  }

  .exercise-editor__buttons button {
    width: 49%;
  }

</style>