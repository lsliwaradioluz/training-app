<template>
<div>
  <div class="trainee" v-if="!$apollo.loading">
    <h1 class="mt0 mb1">{{ user.fullname }}</h1>
    <p>Paruj, aby wyświetlić rozpiskę wybranego treningu w połączeniu z innym. Kopiuj, aby móc skorzystać z wybranego treningu nawet u innego użytkownika.</p>
  <!-- TRENINGI  -->
    <div>
      <h3 class="head row j-between a-center pr0">
        <span>Lista treningów</span>
        <nuxt-link
          class="flaticon-plus-1 t-white" 
          :to="{ path: '/workouts/new', query: { id: $route.params.id } }" 
          tag="i"></nuxt-link>
      </h3>
      <div class="row pb05">
        <button class="button-switch" :class="{ 'button-switch--active': !showHomeworks }" type="button" @click="showHomeworks = false">Treningi</button>
        <button class="button-switch" :class="{ 'button-switch--active': showHomeworks }" type="button" @click="showHomeworks = true">Zadania domowe</button>
      </div>
      <transition-group name="animate-list">
        <Workout v-for="workout in filteredWorkouts" :key="workout.id" :workout="workout" :user="user" />
      </transition-group>
      <p class="pt05 pb05" v-if="filteredWorkouts.length == 0">
        Brak treningów do wyświetlenia
      </p>
    </div>
  </div>
  <Placeholder v-else />
</div>
</template>

<script>

import mainQuery from '~/apollo/queries/users/_id/main.gql';

export default {
  data() {
    return {
      user: Object, 
      workouts: Array,
      showHomeworks: false,
    }
  },
  apollo: {
    user: {
      query: mainQuery, 
      variables() {
        return {
          id: this.$route.params.id
        }
      },
    }
  },
  computed: {
    filteredWorkouts() {
      if (this.showHomeworks) {
        return this.user.workouts.filter(workout => {
          return workout.sticky;
        });
      } else {
        return this.user.workouts.filter(workout => {
          return !workout.sticky;
        })
      }
    }
  }
}
</script>