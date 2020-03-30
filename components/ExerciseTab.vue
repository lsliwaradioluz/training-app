<template>
  <div class="exercise-tab tab p11 column">
    <div class="row j-between a-stretch">
      <nuxt-link class="exercise-tab__link pr1" :to="exercise.id" tag="div" append>
        <h3 class="m00">{{ exercise.name }}</h3>
        <p class="exercise-tab__description m00" v-if="exercise.alias">{{ exercise.alias }}</p>
        <p class="exercise-tab__description m00" v-else>Brak alternatywnej nazwy</p>
      </nuxt-link>
      <div class="row a-center">
        <!-- <i class="flaticon-vertical-dots t-green" @click="showButtonsPanel = !showButtonsPanel"></i> -->
        <ContextMenu>
          <template v-slot:trigger>
            <i class="flaticon-vertical-dots t-green"></i>
          </template>
          <template v-slot:options>
            <button type="button" @click="deleteExercise">
              <i class="flaticon-trash fs-09" style="margin-right: .25rem"></i>
              Usuń
            </button>
            <nuxt-link tag="button" type="button" :to="`${exercise.id}/edit`" append>
              <i class="flaticon-writing fs-09" style="margin-right: .25rem"></i>
              Edytuj
            </nuxt-link>
          </template>
        </ContextMenu>
      </div>
    </div>
  </div>
</template>

<script>
  import deleteExercise from '~/apollo/mutations/deleteExercise.gql';
  
  export default {
    props: ['exercise'], 
    data() {
      return {
        client: this.$apollo.getClient(),
      }
    }, 
    methods: {
      async deleteExercise() {
        if (await this.$root.$confirm('Na pewno chcesz usunąć to ćwiczenie?')) {
          const input = {
            where: {
              id: this.exercise.id
            }
          }

          this.client.mutate({ mutation: deleteExercise, variables: { input: input } })
            .then(res => {
              window.location.reload();
            });
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  .exercise-tab__link {
    flex-basis: 100%;
  }

  .exercise-tab__description {
    font-size: 0.7rem;
  }
</style>