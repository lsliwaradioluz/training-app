<template>
  <form class="tab">
    <h3 class="m00 mb05">
      Edytuj notatkę
    </h3>
    <BaseInput
      ref="textarea"
      v-model="newFeedback"
      placeholder="Jak poszło to ćwiczenie?"
      :show-label="false"
      :show-status="false"
    />
    <div class="buttons">
      <button class="button-primary" type="button" @click="submitChanges">
        Zapisz
      </button>
      <button class="button-primary" type="button" @click="declineChanges">
        Wróć
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    feedback: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      newFeedback: this.feedback,
    }
  },
  methods: {
    submitChanges() {
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
  button {
    width: 49%;
  }
}
</style>
