<template>
  <div class="exercise">
  <!-- NAZWA  -->
    <Head>
      <div class="row j-between" v-if="!edit">
        <span>{{ exercise.name }}</span>
        <i class="flaticon-vertical-dots ml1" @click="showButtonsPanel = !showButtonsPanel" v-if="$store.state.auth.user.admin"/>
      </div>
      <span v-else>Nazwa ćwiczenia</span>
      <transition name="accordion">
        <div class="exercise__panel row mt05" v-if="showButtonsPanel">
          <button :class="{ pb05: showButtonsPanel }" type="button" @click="deleteExercise">Usuń</button>
          <nuxt-link :class="{ pb05: showButtonsPanel }" tag="button" type="button" to="edit" append>Edytuj</nuxt-link>
        </div>
      </transition>
    </Head>
    <p class="mt0 mb05 tab" v-if="edit">
      <input class="input--invisible" placeholder="Wpisz nazwę ćwiczenia" v-model="input.name" spellcheck="false">
    </p>
  <!-- ZDJĘCIE  -->
    <Head v-if="edit">
      <div class="row j-between">
        <h3 class="m00">Zdjęcie</h3>
        <i class="flaticon-plus" @click="launchFileUpload" v-if="edit && !uploadedImage"></i>
        <i class="flaticon-close" @click="deleteImage" v-else></i>
        <form v-show="false">
          <input
            @change="uploadImage"
            ref="input"
            name="files"
            type="file">
        </form>
      </div>  
    </Head>
    <div class="exercise__image" v-if="uploadedImage">
      <img :src="uploadedImage.url" alt="image">
    </div>
    <div class="tab mt05 mb05" v-if="!uploadedImage">
      <p class="m00" style="opacity: 0.5">Na razie brak zdjęcia</p>
    </div>
  <!-- OPIS  -->
    <div v-if="exercise.description || edit">
      <Head>Opis</Head>
      <div class="tab">
        <p class="m00" v-if="!edit">{{ exercise.description }}</p>
        <p class="m00" v-else>
          <textarea 
            class="input--invisible" 
            placeholder="Uzupełnij instrukcję wykonania ćwiczenia" 
            v-model="input.description" 
            rows="5" 
            spellcheck="false"></textarea>
        </p>
      </div>
    </div>
  <!-- BUTTONY ZAPISZ ODRZUĆ  -->
    <div class="exercise__buttons tab p00 row j-between t-green" v-if="edit">
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
        client: this.$apollo.getClient(),
        showButtonsPanel: false,
        endpoint: process.env.NODE_ENV == 'development' ? 'http://localhost:1337/upload' : 'https://powerful-taiga-81942.herokuapp.com/upload',
        uploadedImage: this.exercise.image || null,
        input: {
          name: this.exercise.name,
          description: this.exercise.description,
        }
      }
    },
    methods: {
      launchFileUpload() {
        this.$refs.input.click();
      },
      uploadImage() {
        const formData = new FormData();
        formData.append('files', this.$refs.input.files[0]);
        fetch(this.endpoint, {
          method: 'POST', 
          body: formData
        })
        .then(res => {
          res.json().then(data => {
            this.uploadedImage = data[0];
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
            console.log(res);
            this.$router.go(-1);
          });
      },
      deleteExercise() {
        if (confirm('Na pewno chcesz usunąć to ćwiczenie?')) {
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
      }
    },
  }
</script>

<style lang="scss" scoped>

  .exercise__image {
    position: relative;

    img {
      border-radius: 5px;
      width: 100%;
    }

    div {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
    }
  }

  .exercise__buttons button {
    width: 50%;
  }

  .exercise__panel {
    border-top: 1px solid color(gray);
    font-size: 0.7rem;

    button {
      padding: 1rem;
      flex-basis: 50%;
      font-size: inherit;
    }
  }
</style>