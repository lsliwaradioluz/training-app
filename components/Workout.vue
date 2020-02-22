<template>
  <div class="workout tab column" :class="{ sticky: workout.sticky, pb0: showButtonsPanel }">
  <!-- MAIN TAB -->
    <div class="row j-between a-stretch">
      <nuxt-link class="workout__link" tag="div" :to="`/workouts/${this.workout.id}`">
        <div v-if="!workout.sticky">
          <h3 class="m00">{{ workout.scheduled | reverseDate }}</h3>
          <p class="m00 t-small">{{ workout.scheduled | getDayName }} {{ workout.scheduled | getTime }}</p>
        </div>
        <div v-else>
          <h3 class="m00">Homework</h3>
          <p class="m00 t-small">W dni nietreningowe</p>
        </div>
      </nuxt-link>
      <div v-if="!$route.path.includes('users')">
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
  <!-- BUTTONS  -->
  <transition name="accordion"> 
    <div class="workout__panel row mt05 t-green t-small" v-if="showButtonsPanel">
      <button type="button" @click="deleteWorkout">Usuń</button>
      <nuxt-link
        tag="button"
        type="button" 
        :to="{ path: `/workouts/${workout.id}/edit`, query: { scheduled: this.workout.scheduled } }">Edytuj</nuxt-link>
    </div>
  </transition>
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

  .workout {
    transition: padding 0.3s;
  }

  .workout__link {
    flex-basis: 100%;
  }

  .workout__panel {
    border-top: 1px solid color(gray);

    button {
      padding: 1rem;
      flex-basis: 50%;
      font-size: inherit;
    }
  }

  .sticky {
    position: relative;
    overflow: hidden;
    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      height: 100%;
      width: 3px;
      background-color: color(green);
    }
  }
</style>