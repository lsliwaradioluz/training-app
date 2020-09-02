<template>
  <div class="workout-panel column">
    <BaseHeader v-if="!workout.sticky">
      <span v-if="user.admin && user.username != workout.user.username">{{
        workout.user.username
      }}</span>
      <span v-else>Trening</span>
      <Date :date="workout.scheduled" />
    </BaseHeader>
    <BaseHeader v-else>
      <span v-if="workout.name">{{ workout.name }}</span>
      <span v-else>Trening</span>
    </BaseHeader>
    <p>
      Zapoznaj się z rozpiską, przesuwając palcem w lewo lub w prawo. Skorzystaj
      z Cyfrowego Asystenta, który przeprowadzi Cię przez Twój trening krok po
      kroku. Dodawaj komentarze do ćwiczeń, aby trener wiedział, jak Ci poszło.
    </p>
    <div class="buttons">
      <button
        class="button-tertiary"
        :class="{ 'sole-button': !user.admin }"
        type="button"
        @click="$emit('show-assistant')"
      >
        Asystent
      </button>
      <template v-if="user.admin">
        <nuxt-link
          class="button-tertiary"
          tag="button"
          type="button"
          :to="{
            path: `/workouts/${workout.id}/edit`,
            query: { user: workout.user.id },
          }"
        >
          Edytuj
        </nuxt-link>
        <button
          class="button-tertiary"
          type="button"
          @click="showStopwatch = true"
        >
          Stoper
        </button>
      </template>
    </div>
    <Modal :show="true" v-show="showStopwatch">
      <div class="workout-panel__stopwatch tab">
        <h2>Stoper</h2>
        <Stopwatch />
        <button
          class="workout-panel__stopwatch__button button-primary"
          type="button"
          @click="showStopwatch = false"
        >
          Zamknij
        </button>
      </div>
    </Modal>
  </div>
</template>

<script>
import Date from "~/components/Date";

export default {
  components: { Date },
  props: {
    workout: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showStopwatch: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
};
</script>

<style lang="scss" scoped>
.workout-panel {
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.workout-panel__stopwatch {
  display: flex;
  flex-direction: column;
}

.workout-panel__stopwatch__button {
  margin-top: 2rem;
}

.buttons {
  display: flex;
  justify-content: space-between;
  button {
    flex-basis: 32%;
  }
}

.sole-button {
  flex-grow: 1;
}
</style>
