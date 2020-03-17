<template>
  <div class="user-editor">
    <form class="tab">
      <label for="fullname">Imię i nazwisko</label>
      <input class="input--invisible" type="text" id="fullname" placeholder="np. Jan Kowalski" v-model="fullname" spellcheck="false" autocomplete="off">
      <br>
      <label for="username">Nazwa użytkownika</label>
      <input class="input--invisible" type="text" id="username" placeholder="np. jkowalski" v-model="username" spellcheck="false" autocomplete="off">
      <br>
      <label for="email">Email</label>
      <input class="input--invisible" type="email" id="email" placeholder="np. jankowalski@gmail.com" v-model="email" spellcheck="false" autocomplete="off">
    </form>
    <div class="user-editor__buttons tab p00 row j-between t-green">
      <button class="p11" type="button" @click="user ? updateUser() : createUser()">Zapisz</button>
      <button class="p11" type="button" @click="$router.go(-1)">Wróć</button>
    </div>
  </div>
</template>

<script>
  import createUser from '~/apollo/mutations/createUser.gql';
  import updateUser from '~/apollo/mutations/updateUser.gql';

  export default {
    props: ['users', 'user'],
    data() {
      return {
        client: this.$apollo.getClient(),
        fullname: null,
        username: null, 
        email: null,
      }
    },
    methods: {
      populateFormFields() {
        this.fullname = this.user.fullname;
        this.username = this.user.username;
        this.email = this.user.email;
      },
      generateInput() {
        let input;
        if (!this.user) {
          input = {
            data: {
              user: this.$store.state.auth.user.id,
              username: this.username,
              fullname: this.fullname,
              email: this.email,
              password: '123456',
              confirmed: true, 
              role: "5e1dbf7bc114b11970959399",
              admin: false,
            }
          }
        } else {
          input = {
            where: {
              id: this.user.id
            }, 
            data: {
              fullname: this.fullname,
              username: this.username,
              email: this.email,
            }
          }
        }
        return input;
      },
      createUser() {
        this.client.mutate({ mutation: createUser, variables: { input: this.generateInput() }  })
          .then(res => {
            this.$router.go(-1);
          })
      }, 
      updateUser() {
        this.client.mutate({ mutation: updateUser, variables: { input: this.generateInput() } })
          .then(res => {
            this.$router.go(-1);
          })
      },
    },
    mounted() {
      if (this.user) this.populateFormFields();
    }
  }
</script>

<style lang="scss" scoped>

  label {
    color: color(green);
  }

  .user-editor__buttons button {
    width: 50%;
  }
  
</style>