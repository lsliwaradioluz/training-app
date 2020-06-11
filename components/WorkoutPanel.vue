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
    <div class="buttons row j-between">
      <button
        class="button-tertiary"
        type="button"
        @click="$emit('show-assistant')"
      >
        Asystent
      </button>
    </div>
  </div>
</template>

<script>
import Date from "~/components/Date"

export default {
  components: { Date },
  props: {
    workout: {
      type: Object,
      required: true,
    },
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
  },
}
</script>

<style lang="scss" scoped>
.workout-panel {
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.buttons {
  button {
    flex-basis: 49%;
    flex-shrink: 1;
    flex-grow: 1;
  }
}
</style>
