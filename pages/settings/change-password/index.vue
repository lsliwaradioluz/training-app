<template>
  <div class="change-password">
    <Head>Zmień hasło</Head>
    <form class="tab">
      <p>Ze względów bezpieczeńtwa, wprowadź nowe hasło dwa razy. Jeżeli chcesz sprawdzić, czy podane hasła są takie same, dotknij ikony kłódki, aby je podejrzeć.</p>
      <CustomInput 
        v-model="password"
        placeholder="Nowe hasło" 
        icon="lock"
        type="password"></CustomInput>
      <CustomInput 
        v-model="repeatPassword"
        placeholder="Powtórz hasło" 
        icon="lock"
        type="password"></CustomInput>
    </form>
    <div class="change-password__buttons tab row j-between t-green">
        <button type="button" @click="updatePassword">Zapisz</button>
        <button type="button" @click="$router.go(-1)">Wróć</button>
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
    padding: 1rem;
    button {
      width: 50%;
      color: color(green);
    }
  }
</style>