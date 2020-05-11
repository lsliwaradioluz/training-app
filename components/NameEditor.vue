<template>
  <form class="tab">
    <h3 class="m00">Edytuj nazwę</h3>
    <CustomInput
      ref="input" 
      v-model="newName">
    </CustomInput>
    <div class="buttons">
      <button class="button-primary" type="button" @click="submitChanges">Zapisz</button>
      <button class="button-primary" type="button" @click="declineChanges">Wróć</button>
    </div>
  </form>
</template>

<script>
  export default {
    props: {
      name: {
        type: String, 
        required: true, 
      }
    }, 
    data() {
      return {
        newName: this.name, 
      }
    },
    methods: {
      submitChanges() {
        const trimmedName = this.newName.trim();
        if (trimmedName.length < 3) {
          this.$store.commit('main/setNotification', 'Nazwa musi składać się z co najmniej 3 liter');
          return
        } 
        this.$emit('name-edited', trimmedName);
      },
      declineChanges() {
        this.$emit('close');
      }
    },
    mounted() {
      this.$refs.input.focus();
    }
  }
</script>

<style lang="scss" scoped>
  .buttons {
    display: flex; 
    justify-content: space-between;
    margin-top: 2rem;
    button {
      width: 49%;
    }
  }
</style>