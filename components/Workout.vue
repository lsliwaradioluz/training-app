<template>
  <div class="workout tab p11 row j-between a-center">
    <div>
      <h3 class="m00">{{ workout.scheduled | reverseDate }}</h3>
      <p class="m00">{{ workout.scheduled | getDayName }} {{ workout.scheduled | getTime }}</p>
    </div>
    <div v-if="!$route.path.includes('trainees')">
      <nuxt-link 
        class="button--primary"
        :class="{ 'button--inactive': !workout.ready }"
        :to="`/workouts/${this.workout.id}`" 
        tag="button"
        :disabled="!workout.ready">Plan</nuxt-link>
    </div>
    <div class="row t-green" v-else>
      <nuxt-link :to="`/workouts/${this.workout.id}`" tag="i" class="flaticon-list mr05" v-if="workout.ready"></nuxt-link>
      <nuxt-link :to="`/workouts/${workout.id}/edit`" tag="i" class="flaticon-adjust mr05"></nuxt-link>
      <i class="flaticon-close" @click="deleteWorkout"></i>
    </div>
  </div>
</template>

<script>
  import deleteWorkout from '~/apollo/mutations/deleteWorkout.gql';

  export default {
    props: ['workout'],
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