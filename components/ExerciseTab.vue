<template>
  <div class="exercise-tab tab p11 column" :class="{ pb0: showButtonsPanel }">
    <div class="row j-between a-stretch">
      <nuxt-link class="exercise-tab__link pr1" :to="removeWhitespace(exercise.name)" tag="div" append>
        <h3 class="m00">{{ exercise.name }}</h3>
        <p class="exercise-tab__description m00">Poziom {{ index + 1 }}</p>
      </nuxt-link>
      <div class="row a-center">
        <i class="flaticon-vertical-dots t-green" @click="showButtonsPanel = !showButtonsPanel"></i>
      </div>
    </div>
    <transition name="accordion">
      <div class="exercise-tab__panel row mt05 t-green" v-if="showButtonsPanel">
        <button type="button" @click="deleteExercise">Usuń</button>
        <nuxt-link tag="button" type="button" :to="`${removeWhitespace(exercise.name)}/edit`" append>Edytuj</nuxt-link>
      </div>
    </transition>
  </div>
</template>

<script>
  import deleteExercise from '~/apollo/mutations/deleteExercise.gql';
  
  export default {
    props: ['exercise', 'index'], 
    data() {
      return {
        showButtonsPanel: false, 
        client: this.$apollo.getClient(),
      }
    }, 
    methods: {
      deleteExercise() {
        if (confirm('Na pewno chcesz usunąć to ćwiczenie?')) {
          const input = {
            where: {
              id: this.exercise.id
            }
          }

          this.client.mutate({ mutation: deleteExercise, variables: { input: input } })
            .then(res => {
              window.location.reload(true);
            });
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  .exercise-tab {
    transition: padding 0.3s;
  }

  .exercise-tab__link {
    flex-basis: 100%;
  }

  .exercise-tab__description {
    font-size: 0.7rem;
  }

  .exercise-tab__panel {
    border-top: 1px solid color(gray);
    font-size: 0.7rem;

    button {
      padding: 1rem;
      flex-basis: 50%;
      font-size: inherit;
    }
  }
</style>