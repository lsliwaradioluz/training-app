<template>
  <div class="exercisetab tab p11 column">
    <div class="row j-between a-stretch">
      <nuxt-link class="exercisetab__link pr1" :to="removeWhitespace(exercise.name)" tag="div" append>
        <h3 class="m00">{{ exercise.name }}</h3>
        <p class="exercisetab__description m00">Poziom {{ index + 1 }}</p>
      </nuxt-link>
      <div class="row a-center">
        <i class="flaticon-vertical-dots t-green" @click="showButtonsPanel = !showButtonsPanel"></i>
      </div>
    </div>
    <div class="exercisetab__panel row mt05 pt1 t-green" v-if="showButtonsPanel">
      <button type="button" @click="deleteExercise">Usuń</button>
      <nuxt-link tag="button" type="button" :to="`${removeWhitespace(exercise.name)}/edit`" append>Edytuj</nuxt-link>
    </div>
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

  .exercisetab__link {
    flex-basis: 100%;
  }

  .exercisetab__description {
    font-size: 0.7rem;
  }

  .exercisetab__panel {
    border-top: 1px solid color(gray);
    font-size: 0.7rem;

    button {
      flex-basis: 50%;
      font-size: inherit;
    }
  }
</style>