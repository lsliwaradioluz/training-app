<template>
  <div class="exercise">
  <!-- NAZWA  -->
    <Head>
      <div class="row j-between" v-if="!edit">
        <span>{{ exercise.name }}</span>
        <nuxt-link 
          class="flaticon-adjust ml1" 
          tag="i" 
          to="edit" 
          v-if="$store.state.auth.user.admin" 
          append />
      </div>
      <span v-else>Nazwa ćwiczenia</span>
    </Head>
    <p class="mt0 mb05 tab" v-if="edit">
      <input class="input--invisible" placeholder="Wpisz nazwę ćwiczenia" v-model="input.name" spellcheck="false">
    </p>
  <!-- ZDJĘCIA  -->
    <Head v-if="edit">
      <div class="row j-between">
        <h3 class="m00">Zdjęcia</h3> 
        <i class="flaticon-plus" @click="launchFileUpload" v-if="edit"></i>
        <form v-show="false">
          <input
            @change="onFilesUpload"
            ref="input"
            name="files"
            type="file"
            multiple>
        </form>
      </div>  
    </Head>
    <div class="exercise__images mb05" v-if="edit && uploadedFiles.length > 0">
      <div class="tab p11 column j-center t-green">
        <p class="mb05" v-if="uploadedFiles.length > 0">Wybrano plików: {{ uploadedFiles.length }}</p>
        <p class="row j-between mb0" v-for="(file, index) in uploadedFiles" :key="index">
          <span>{{ file.name | cutFilename }}</span>
          <i class="flaticon-close small" @click="deleteUploadedFile(index)"></i>
        </p>
      </div>
    </div>
    <Carousel 
      v-if="existingImages.length > 0"
      :pagination="false" 
      :active="existingImages.length > 1"
      :startFromPage="currentImage"
      @changePage="currentImage = $event">
      <div
        v-for="(image, index) in existingImages"
        :key="image.id"
        class="exercise__image mb05">
        <img :src="image.url" :alt="`foto${index}`">
        <div class="row j-end a-start" v-if="edit">
          <i class="flaticon-close mr1 mt05" @click="deleteExistingImage(index)"></i>
        </div>
      </div>
    </Carousel>
  <!-- OPIS  -->
    <div v-if="exercise.description || edit">
      <Head>Opis</Head>
      <div class="tab">
        <div v-if="!edit">
          <p class="mb05" v-for="(p, index) in description" :key="index">{{ index + 1 }}. {{ p }}</p>
        </div>
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
      <button class="p11" type="button" @click="createSaveChanges" v-if="exercise.id == null">Zapisz</button>
      <button class="p11" type="button" @click="updateSaveChanges" v-else>Zapisz</button>
      <button class="p11" type="button" @click="$router.go(-1)">Wróć</button>
    </div>
  </div>
</template>

<script>
  import createExercise from '~/apollo/mutations/createExercise.gql';
  import updateExercise from '~/apollo/mutations/updateExercise.gql';
  import uploadPhoto from '~/apollo/mutations/uploadPhoto.gql';

  export default {
    props: {
      exercise: {
        type: Object,
        default: () => {
          return { name: '', images: [], description: '', technique: '' }
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
        endpoint: process.env.NODE_ENV == 'development' ? 'http://localhost:1337/upload' : 'https://powerful-taiga-81942.herokuapp.com/upload',
        existingImages: this.exercise.images,
        uploadedFiles: [],
        currentImage: 0,
        input: {
          name: this.exercise.name,
          description: this.exercise.description,
        }
      }
    },
    computed: {
      description() {
        return this.exercise.description ? this.exercise.description.split('.') : [];
      },
    }, 
    methods: {
      launchFileUpload() {
        this.$refs.input.click();
      },
      onFilesUpload({ target }) {
        this.uploadedFiles.push(...target.files);
      },
      deleteUploadedFile(index) {
        this.uploadedFiles.splice(index, 1);
      },
      deleteExistingImage(index) {
        this.existingImages.splice(index, 1);
        this.currentImage = 0;
      },
      createExercise() {
        const input = {
          data: this.input
        }
        this.client.mutate({ mutation: createExercise, variables: { input: input } })
          .then(res => {
            this.$router.go(-1);
          });
      }, 
      updateExercise() {
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
      createSaveChanges() {
        if (this.$refs.input.files.length > 0) {
          const formData = new FormData();
          this.uploadedFiles.forEach(cur => {
            formData.append('files', cur);
          });
          fetch(this.endpoint, {
            method: 'POST', 
            body: formData
          })
          .then(res => {
            res.json().then(data => {
              let IDs = []
              data.forEach(cur => {
                IDs.push(cur.id);
              });
              
              this.input.images = IDs;
              this.createExercise();
            });
          })
        } else {
          this.createExercise();
        }

      //   if (this.uploadedFiles.length > 0) {
      //     this.client.mutate({ mutation: uploadPhoto, variables: { files: this.uploadedFiles } })
      //       .then(res => {
      //         let IDs = []
      //         res.data.multipleUpload.forEach(cur => {
      //           IDs.push(cur.id);
      //         });
              
      //         this.input.images = IDs;
      //         this.createExercise();
      //       });
      //   } else {
      //     this.createExercise();
      //   }
      },
      updateSaveChanges() {
        this.input.images = [];
        this.existingImages.forEach(cur => {
          this.input.images.push(cur.id);
        });

        if (this.$refs.input.files.length > 0) {
          const formData = new FormData();
          this.uploadedFiles.forEach(cur => {
            formData.append('files', cur);
          });
          fetch(this.endpoint, {
            method: 'POST', 
            body: formData
          })
          .then(res => {
            res.json().then(data => {
              data.forEach(cur => {
                this.input.images.push(cur.id);
              });
              this.updateExercise();
            });
          })
        } else {
          this.updateExercise();
        }
        
        // if (this.uploadedFiles.length > 0) {
        //   this.client.mutate({ mutation: uploadPhoto, variables: { files: this.uploadedFiles } })
        //     .then(res => {
        //       res.data.multipleUpload.forEach(cur => {
        //         this.input.images.push(cur.id);
        //       });
        //       this.updateExercise();
        //     });
        // } else {
        //   this.updateExercise();
        // }
      },
    },
  }
</script>

<style lang="scss" scoped>

  .exercise__images {
    span {
      font-size: 0.7rem;
    }
  }

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

  .rotated {
    transform: rotate(180deg);
  }
</style>