<template>
  <form class="tab">
    <h3 class="m00 mb05">
      Dodaj notatkę dla {{ unit.exercise.name }}
    </h3>
    <BaseInput
      ref="textarea"
      v-model="newFeedback"
      placeholder="Jak poszło to ćwiczenie?"
      :show-label="false"
      :show-status="false"
    />
    <div class="buttons">
      <button class="button button-primary" type="button" @click="submitChanges" :disabled="submitBtnDisabled">
        Zapisz
      </button>
      <button class="button button-primary" type="button" @click="declineChanges">
        Wróć
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    unit: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newFeedback: this.unit.feedback,
      submitBtnDisabled: false
    }
  },
  methods: {
    submitChanges() {
      this.submitBtnDisabled = true
      this.$emit("feedback-edited", this.newFeedback)
    },
    declineChanges() {
      this.$emit("close")
    },
  },
}
</script>

<style lang="scss" scoped>
.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.button {
  width: 49%;
  &:disabled {
    background-color: color(faded);
  }
}
</style>
