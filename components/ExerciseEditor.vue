<template>
  <div class="exercise-editor">
  <!-- NAZWA  -->
    <Head>Nazwy ćwiczenia</Head>
    <form class="tab">
      <label class="t-green" for="fullname">Nazwa główna</label>
      <input class="input--invisible" type="text" id="fullname" placeholder="np. pull-ups" v-model="input.name" spellcheck="false" autocomplete="off">
      <br>
      <label class="t-green" for="username">Nazwa alternatywna</label>
      <input class="input--invisible" type="text" id="username" placeholder="np. podciąganie na drążku" v-model="input.alias" spellcheck="false" autocomplete="off">
    </form>
  <!-- ZDJĘCIE  -->
    <Head v-if="edit">
      <div class="row j-between">
        <h3 class="m00">Zdjęcie</h3>
        <i class="flaticon-close" @click="deleteImage" v-if="edit && uploadedImage"></i>
        <form v-show="false">
          <input
            @change="uploadImage"
            ref="input"
            name="files"
            type="file">
        </form>
      </div>  
    </Head>
    <div class="exercise-editor__image" v-if="uploadedImage">
      <img :src="uploadedImage.url">
    </div>
    <div class="tab mt05 mb05 p32 column a-center j-center" v-if="edit && !uploadedImage">
      <span class="column j-center a-center" style="opacity: 0.5" v-if="!loadingImage">
        <i class="flaticon-plus fs-2" @click="launchFileUpload" />
        <p class="m00 mt05 t-small">Na razie brak zdjęcia</p>
      </span>
      <span class="column j-center a-center" style="opacity: 0.5" v-else>
        <i class="flaticon-counterclockwise fs-2 icon--spinning"></i>
        <p class="m00 mt05 t-small">Wczytuję...</p>
      </span>
    </div>
  <!-- OPIS  -->
    <div>
      <Head>Opis</Head>
      <div class="tab">
        <p class="m00">
          <span v-if="!edit">
            <span class="m00" v-if="exercise.description">{{ exercise.description }}</span>
            <span class="m00" style="opacity: 0.5" v-else>Na razie brak opisu</span>
          </span>
          <textarea 
            class="input--invisible" 
            placeholder="Uzupełnij instrukcję wykonania ćwiczenia" 
            v-model="input.description" 
            rows="5" 
            spellcheck="false"
            v-else></textarea>
        </p>
      </div>
    </div>
  <!-- BUTTONY ZAPISZ ODRZUĆ  -->
    <div class="exercise-editor__buttons tab p00 row j-between t-green" v-if="edit">
      <button class="p11" type="button" @click="createExercise" v-if="exercise.id == null">Zapisz</button>
      <button class="p11" type="button" @click="updateExercise" v-else>Zapisz</button>
      <button class="p11" type="button" @click="$router.go(-1)">Wróć</button>
    </div>
  </div>
</template>

<script>
  import deleteExercise from '~/apollo/mutations/deleteExercise.gql';
  import createExercise from '~/apollo/mutations/createExercise.gql';
  import updateExercise from '~/apollo/mutations/updateExercise.gql';

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
        showButtonsPanel: false,
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
        this.client.mutate({ mutation: createExercise, variables: { input: input } })
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
      async deleteExercise() {
        if (await this.$root.$confirm('Na pewno chcesz usunąć to ćwiczenie?')) {
          const input = {
            where: {
              id: this.exercise.id
            }
          }

          this.client.mutate({ mutation: deleteExercise, variables: { input: input } })
            .then(res => {
              this.$router.go(-1);
            });
        }
      }, 
      recordVoiceName() {
        navigator.mediaDevices.getUserMedia({audio: true})
        .then(mediaStreamObj => {
          this.audioSource = mediaStreamObj;
        });
      }
    },
  }
</script>

<style lang="scss" scoped>

  .exercise-editor__image {
    height: 90%;
    img {
      border-radius: 5px;
      width: 100%;
    }
  }

  .exercise-editor__buttons button {
    width: 50%;
  }

  .exercise-editor__panel {
    border-top: 1px solid color(gray);
    font-size: 0.7rem;

    button {
      padding: 1rem;
      flex-basis: 50%;
      font-size: inherit;
    }
  }

</style>