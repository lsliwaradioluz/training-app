<template>
  <form class="tab">
    <h3 class="mt0 t-green">Zmień hasło</h3>
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
    <div class="user-editor__buttons p00 pt2 row j-between t-green">
      <button type="button" @click="updateUser('update-password')">Zapisz</button>
      <button type="button" @click="showPasswordModal = false">Wróć</button>
    </div>
  </form>  
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>

</style>