<template>
  <div class="sendpassword main">
    <input v-model="email">
    <button @click="sendPassword">Resetuj hasło</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        email: ''
      }
    },
    methods: {
      sendPassword() {
        const endpoint = process.env.NODE_ENV == 'development' ? 'http://localhost:1337/auth/forgot-password' : 'https://powerful-taiga-81942.herokuapp.com/auth/forgot-password';
        this.$axios.$post(endpoint, {
          email: this.email
        })
          .then(res => {
            console.log(res);
            
          })
          .catch(err => {
            console.log(err.message);
          })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>