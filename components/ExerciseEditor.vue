<template>
  <div class="exercise-editor">
    <p>Uzupełnij nazwy, opis oraz animację swojego ćwiczenia. W aplikacji Piti najlepiej sprawdzają się animacje w formacie .gif o rozdzielczości 16:9.</p>
  <!-- NAZWA  -->
    <form>
      <CustomInput 
        v-model="input.name"
        placeholder="Angielska nazwa"
        :show-status="false"
        />
      <CustomInput 
        v-model="input.alias"
        placeholder="Polska nazwa"
        :show-status="false"
        />
    </form>
  <!-- ZDJĘCIE  -->
    <div class="exercise-editor__image-upload p32 column a-center j-center" v-if="!uploadedImage">
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
    </div>
    <div class="exercise-editor__image column a-center" v-else>
      <img :src="uploadedImage.url" alt="exercise image">
      <button class="button-secondary mt05" type="button" @click="deleteImage">Usuń zdjęcie</button>
    </div>
  <!-- OPIS  -->
    <CustomTextarea
      class="mt1"
      :value="input.description"
      placeholder="Opis ćwiczenia"
      @type="input.description = $event" />
  <!-- BUTTONY ZAPISZ ODRZUĆ  -->
    <div class="exercise-editor__buttons row j-between mt2">
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
    background-size: cover;
    background-position: center;
    transition: background-image 0.3s;
  }

  .exercise-editor__image-upload {
    border: 1px solid color(faded);
    color: color(faded);
    border-radius: 6px;
    margin-top: 2rem;
    margin-bottom: 0;
  }

  img {
    width: 100%;
  }

  .exercise-editor__buttons button {
    width: 49%;
  }

</style>