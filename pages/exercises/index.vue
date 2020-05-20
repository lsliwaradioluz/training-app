<template>
  <div>
    <LazyWrapper :loading="$apollo.loading">
      <div class="exercises">
        <Header>
          <span>Ćwiczenia</span>
          <nuxt-link class="flaticon-plus ml1 t-white" :to="{ path: 'new' }" append v-if="user.admin"></nuxt-link>
        </Header>
        <p class="mb0" v-if="user.admin">Dotknij karty ćwiczenia, aby wyświetlić szczegóły. Dodaj nowe, dotykając ikony plusa. Edytuj lub usuń ćwiczenie, rozwijająć menu kontekstowe przy jego karcie.</p>
        <p class="mb0" v-else>Baza Piti zawiera blisko sto ćwiczeń. Wyszukuj je po nazwie polskiej lub angielskiej. Możesz także przeglądać wybrane kategorie.</p>
        <CustomSearch 
          :value="search"
          placeholder="Szukaj ćwiczenia"
          @input="searchFunction($event)">
        </CustomSearch>
        <div class="row mb1" v-if="!search">
          <nuxt-link 
            class="button-switch" 
            :class="{ 'button-switch--active': category == 'strength' }" 
            tag="button" 
            type="button" 
            :to="{ query: { category: 'strength' } }">
            Siła
          </nuxt-link>
          <nuxt-link 
            class="button-switch" 
            :class="{ 'button-switch--active': category == 'conditioning' }" 
            tag="button" 
            type="button" 
            :to="{ query: { category: 'conditioning' } }">
            Kondycja
          </nuxt-link>
          <nuxt-link 
            class="button-switch" 
            :class="{ 'button-switch--active': category == 'mobility' }"
            tag="button"
            type="button"
            :to="{ query: { category: 'mobility' } }">
            Mobilność
          </nuxt-link>
        </div>
        <template v-if="filteredExercises.length > 0">
          <transition-group name="animate-list">
            <ExerciseTab 
              v-for="exercise in filteredExercises" 
              :key="exercise.id"
              :exercise="exercise" />
          </transition-group>
        </template>
        <p v-else>Brak ćwiczeń</p>
      </div>
    </LazyWrapper>
  </div>
</template>

<script>
  import getAllExercises from '~/apollo/queries/getAllExercises.gql';

  export default {
    apollo: {
      exercises: {
        query: getAllExercises, 
      }
    },
    data() {
      return {
        exercises: [],
      }
    }, 
    computed: {
      user() {
        return this.$store.getters['auth/user'];
      },
      category() {
        if (this.$route.query.category) {
          return this.$route.query.category; 
        } else {
          return 'strength'
        }
      },
      search() {
        return this.$route.query.search; 
      },
      filteredExercises() {
        if (this.search) {
          return this.exercises.filter(exercise => {
            const search = this.search.toLowerCase();
            const alias = exercise.alias ? exercise.alias : '';
            const exerciseName = exercise.name.toLowerCase() + alias.toLowerCase();
            const conditions = exerciseName.includes(search) || search.includes(exerciseName);
            return conditions;
          });
        } else if (this.category) {
          return this.exercises.filter(exercise => {
            return exercise.category && exercise.category.toLowerCase() == this.category;
          });
        } else {
          return this.exercises;
        }
      },
    }, 
    methods: {
      searchFunction(search) {
        if (search) {
          this.$router.push({ query: { search } });
        } else {
          this.$router.push({ query: {} });
        }
      }
    }
  }
</script>