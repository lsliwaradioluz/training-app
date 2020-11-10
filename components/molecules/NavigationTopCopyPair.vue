<template>
  <div class="copy-pair">
    <p v-if="workoutToPair" class="row j-between">
      Parujesz z {{ workoutToPair.user.username }}
      {{ workoutToPair.scheduled | reverseDate }}
      <button
        class="flaticon-cancel fs-12"
        type="button"
        @click="stopPairWorkout"
      />
    </p>
    <p v-if="workoutToCopy" class="row j-between">
      Kopiujesz {{ workoutToCopy.user.username }}
      {{ workoutToCopy.scheduled | reverseDate }}
      <button
        class="flaticon-cancel fs-12"
        type="button"
        @click="stopCopyWorkout"
      />
    </p>
  </div>
</template>

<script>
export default {
  props: {
    workoutToCopy: {
      type: Object,
      required: false,
    },
    workoutToPair: {
      type: Object,
      required: false,
    },
  },
  methods: {
    stopPairWorkout() {
      if (!this.workoutToCopy) {
        this.$emit("close");
      }
      this.$store.dispatch("main/removeEntryFromDb", "workoutToPair");
    },
    stopCopyWorkout() {
      if (!this.workoutToPair) {
        this.$emit("close");
      }
      this.$store.dispatch("main/removeEntryFromDb", "workoutToCopy");
    },
  },
};
</script>

<style lang="scss" scoped>
.copy-pair {
  position: absolute;
  top: 3.5rem;
  right: 0;
  padding: 0 1rem;
  width: 100%;
  p {
    position: relative;
    width: 100%;
    padding: 0.5rem;
    color: color(primary);
    background-color: color(headers);
  }
}
</style>
