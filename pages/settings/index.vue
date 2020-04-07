<template>
  <div class="settings">
    <div class="tab column a-center pt2 pb2">
      <div 
        class="avatar"
        :class="{ 'avatar--loading': loadingImage }" 
        :style="{ backgroundImage: `url(${user.image ? user.image.url : require('assets/images/user.svg') })` }">
      </div>
      <h3 class="mt05 mb05">{{ user.fullname }}</h3>
      <div class="settings__panel-buttons row j-between">
        <button type="button" @click="launchFileUpload">Zmień awatar</button>
        <button type="button" @click="user.image = null">Usuń awatar</button>
        <nuxt-link type="button" tag="button" to="change-password" append>Zmień hasło</nuxt-link>
      </div>
      <form v-show="false">
        <input
          @change="uploadImage"
          ref="input"
          name="files"
          type="file">
      </form>
    </div>
    <Head>Edytuj dane</Head>
    <form class="tab">
      <CustomInput 
        class="mb05"
        v-model="user.fullname"
        placeholder="Imię i nazwisko" 
        icon="user-1"
        type="text"
        :show-status="false"></CustomInput>
      <CustomInput 
        class="mb05"
        v-model="user.username"
        placeholder="Nazwa użytkownika" 
        icon="user-1"
        type="text"
        :show-status="false"></CustomInput>
      <CustomInput 
        v-model="user.email"
        placeholder="Adres e-mail" 
        icon="email"
        type="email"
        :show-status="false"></CustomInput>
    </form>
    <div class="user-editor__buttons tab row j-between">
      <button class="p11" type="button" @click="user ? updateUser() : createUser()">Zapisz</button>
      <button class="p11" type="button" @click="$router.go(-1)">Wróć</button>
    </div>
  </div>  
</template>

<script>
  import updateUser from '~/apollo/mutations/updateUser.gql';

  export default {
    data() {
      return {
        user: {...this.$store.getters['auth/user']},
        client: this.$apollo.getClient(),
        endpoint: process.env.NODE_ENV == 'development' ? 'http://localhost:1337/upload' : 'https://piti-backend.herokuapp.com/upload',
        loadingImage: false,
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
            this.user.image = data[0];
            this.loadingImage = false;
          });
        })
      },
      updateUser() {
        const input = {
          where: {
            id: this.user.id
          }, 
          data: {
            fullname: this.user.fullname,
            username: this.user.username,
            email: this.user.email,
            image: this.user.image ? this.user.image.id : null,
          }
        } 

        this.client.mutate({ mutation: updateUser, variables: { input: input } })
          .then(res => {
            this.$store.commit('auth/setUser', res.data.updateUser.user);
            this.$router.go(-1);
          })
      },
    },
  }
</script>

<style lang="scss" scoped>

  .settings__panel-buttons {
    button {
      color: color(green);
      font-size: 10px;
    }

    button:nth-child(1) {
      padding-right: 5px;
      border-right: 1px solid rgba(230, 230, 230, 0.08); 
    }

    button:nth-child(2) {
      padding: 0 5px;
      border-left: 1px solid rgba(230, 230, 230, 0.08);
      border-right: 1px solid rgba(230, 230, 230, 0.08); 
    }

    button:nth-child(3) {
      padding-left: 5px;
      border-left: 1px solid rgba(230, 230, 230, 0.08);
    }
  }
  .avatar {
    height: 80px;
    width: 80px;
    position: relative;
  }

  .avatar--loading::after {
    content: "⭮";
    color: gray;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.589);
    border-radius: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: spin 1.5s linear infinite;
  }

  .user-editor__buttons {
    padding: 0;
    button {
      width: 50%;
      color: color(green);
    }
  }
  
</style>