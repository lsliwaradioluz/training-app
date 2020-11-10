<template>
  <nav class="navigation-top" role="navigation">
    <ul class="buttons">
      <li>
        <button class="flaticon-left-arrow-2" @click="$router.go(-1)" />
      </li>
      <li>
        <button class="flaticon-continuous" @click="reloadPage" />
        <button
          v-if="
            $store.state.main.workoutToPair || $store.state.main.workoutToCopy
          "
          class="flaticon-bell copy-pair-icon"
          @click="showCopyPair = !showCopyPair"
        />
      </li>
    </ul>
    <Modal :show="showCopyPair" @close="showCopyPair = false">
      <CopyPair
        :workout-to-pair="workoutToPair"
        :workout-to-copy="workoutToCopy"
        @close="showCopyPair = false"
      />
    </Modal>
  </nav>
</template>

<script>
import CopyPair from "./NavigationTopCopyPair";
export default {
  components: { CopyPair },
  data() {
    return {
      showCopyPair: false,
    };
  },
  computed: {
    workoutToPair() {
      return this.$store.state.main.workoutToPair;
    },
    workoutToCopy() {
      return this.$store.state.main.workoutToCopy;
    },
  },
  methods: {
    reloadPage() {
      window.location.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
.buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  padding: 1rem;
  li {
    padding-left: 0;
    border: none;
    display: flex;
    color: color(faded);
  }
}

.copy-pair-icon {
  z-index: 1004;
  color: color(headers);
  margin-left: 0.5rem;
}
</style>
