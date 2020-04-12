<template>
  <div class="change-password">
    <p>Ze względów bezpieczeńtwa, wprowadź nowe hasło dwa razy. Jeżeli chcesz sprawdzić, czy podane hasła są takie same, dotknij ikony kłódki, aby je podejrzeć.</p>
    <form class="tab">
      <CustomInput 
        v-model="password"
        icon="lock"
        placeholder="Nowe hasło"
        type="password"></CustomInput>
      <CustomInput 
        v-model="repeatPassword"
        icon="lock"
        placeholder="Powtórz hasło"
        type="password"></CustomInput>
    </form>
    <div class="change-password__buttons tab row j-between t-green">
        <button class="button-primary" type="button" @click="updatePassword">Zapisz</button>
        <button class="button-primary" type="button" @click="$router.go(-1)">Wróć</button>
      </div>
  </div>
</template>

<script>
  import updateUser from '~/apollo/mutations/updateUser.gql';

  export default {
    data() {
      return {
        client: this.$apollo.getClient(),
        password: null, 
        repeatPassword: null,
        user: this.$store.getters['auth/user'],
      }
    }, 
    methods: {
      updatePassword() {
        const input = {
          where: {
            id: this.user.id
          }, 
          data: {
            password: this.password
          }
        } 

        if (this.password == this.repeatPassword) {
          this.client.mutate({ mutation: updateUser, variables: { input: input } })
          .then(res => {
            this.$router.go(-1);
          });
        } else {
          this.$store.commit('main/setNotification', 'Podane hasła nie są takie same');
        }
      }, 
    }
  }
</script>

<style lang="scss" scoped>

  .change-password__buttons {
    margin-top: 1rem;
    button {
      width: 49%;
      color: color(green);
    }
  }
</style>