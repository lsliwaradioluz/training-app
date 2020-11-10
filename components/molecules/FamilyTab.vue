<template>
  <div class="family-tab">
    <nuxt-link class="link" :to="this.family.id" append>
      <Header>{{ family.name }}</Header>
      <Caption>{{ familyCaption }}</Caption>
    </nuxt-link>
    <Icon name="right-arrow" />
  </div>
</template>

<script>
import Header from "../atoms/TabHeader";
import Caption from "../atoms/TabCaption";
import Icon from "../atoms/TabIcon";

export default {
  components: { Header, Caption, Icon },
  props: {
    family: {
      type: Object,
      required: true,
    },
  },
  computed: {
    familyCaption() {
      let exerciseDeclination;
      const numberOfExercises = this.family.exercises.length;

      if (numberOfExercises == 1) {
        exerciseDeclination = "ćwiczenie";
      } else if ([2, 3, 4].includes(numberOfExercises)) {
        exerciseDeclination = "ćwiczenia";
      } else {
        exerciseDeclination = "ćwiczeń";
      }

      return `Kategoria | ${numberOfExercises} ${exerciseDeclination}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.family-tab {
  padding: 0.5rem 0;
  display: flex;
  justify-content: space-between;
}

.link {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  padding-right: 1rem;
  text-align: left;
}
</style>
