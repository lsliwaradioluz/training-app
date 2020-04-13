<template>
  <div class="dashboard">
    <div v-if="!$apollo.loading">
      <h1 class="mt0 mb2">Pulpit</h1>
      <!-- <Slider :slides="slides" /> -->
      <!-- <h3 class="t-white mb05">Najnowszy trening</h3>
      <Workout :workout="user.workouts[0]" /> -->
    </div>
    <Placeholder v-else />
  </div>  
</template>

<script>
import mainQuery from '~/apollo/queries/dashboard/main.gql';

export default {
  apollo: {
    user: {
      query: mainQuery, 
      variables() {
        return {
          id: this.$store.state.auth.user.id, 
        }
      }
    }
  },
  data() {
    return {
      slides: [
        { 
          header: 'Wszystkie ćwiczenia w jednym miejscu', 
          caption: 'Baza aplikacji Piti zawiera ponad 100 ćwiczeń, z których można ułożyć trening. Każde z nich opatrzone jest opisem oraz animacją poglądową.', 
          image: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
        },
        { 
          header: 'Asystent na każde wezwanie', 
          caption: 'Nie możesz rozczytać rozpiski od trenera? Skorzystaj z pomocy cyfrowego asystenta treningu.', 
          image: 'https://images.unsplash.com/photo-1536659272167-0a78858abb46?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
        },
        { 
          header: 'Układaj treningi w tempie błyskawicy', 
          caption: 'Z rewolucyjnym edytorem treningów przygotowywanie planów dla podopiecznych jeszcze nigdy nie było tak proste!', 
          image: 'https://images.unsplash.com/photo-1575859694244-0b337bf58e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
  


</style>


