<template>
  <div class="workout tab column">
    <!-- main view -->
    <div class="row j-between a-stretch">
      <nuxt-link class="workout__link" tag="div" :to="`/workouts/${this.workout.id}`">
        <h3 class="m00">{{ workout.scheduled | reverseDate }}</h3>
        <p class="m00 t-small">{{ workout.scheduled | getDayName }} {{ workout.scheduled | getTime }}</p>
      </nuxt-link>
      <div v-if="!$route.path.includes('trainees')">
        <nuxt-link 
          class="button--primary"
          :class="{ 'button--inactive': !workout.ready }"
          :to="`/workouts/${this.workout.id}`" 
          tag="button"
          :disabled="!workout.ready">Plan</nuxt-link>
      </div>
      <div class="row a-center" v-else>
        <i class="flaticon-vertical-dots t-green" @click="showButtonsPanel = !showButtonsPanel"></i>
      </div>
    </div>
    <!-- buttons  -->
    <div class="workout__panel row mt05 pt1 t-green t-small" v-if="showButtonsPanel">
      <button @click="deleteWorkout">Usuń</button>
      <nuxt-link :to="`/workouts/${workout.id}/edit`" tag="button" type="button">Edytuj</nuxt-link>
    </div>
  </div>
</template>

<script>
  import deleteWorkout from '~/apollo/mutations/deleteWorkout.gql';

  export default {
    props: ['workout'],
    data() {
      return {
        showButtonsPanel: false
      }
    },
    methods: {
      deleteWorkout() {
        const input = {
          where: {
            id: this.workout.id,
          },
        }
        const client = this.$apollo.getClient();
        if (confirm("Czy na pewno chcesz usunąć ten element?")) {
          client.mutate({ mutation: deleteWorkout, variables: { input: input }  })
            .then(res => {
              window.location.reload(true);
            })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .workout__link {
    flex-basis: 100%;
  }

  .workout__panel {
    border-top: 1px solid color(gray);

    button {
      flex-basis: 50%;
      font-size: inherit;
    }
  }
</style>