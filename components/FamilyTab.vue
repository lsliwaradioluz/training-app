<template>
  <div class="family-tab">
    <div class="row j-between">
      <nuxt-link class="link pr1 row" :to="this.family.id" append>
        <div>
          <h4 class="family-tab__name">
            {{ family.name }}
          </h4>
          <p class="description t-medium t-faded m00">
            {{ familyCaption }}
          </p>
        </div>
      </nuxt-link>
      <span
        class="flaticon-right-arrow t-headers row a-center"
      />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      family: {
        type: Object, 
        required: true, 
      }
    },
    computed: {
      familyCaption() {
      let exerciseDeclination;
      const numberOfExercises = this.family.exercises.length

      if (numberOfExercises == 1) {
          exerciseDeclination = "ćwiczenie"
      } else if ([2,3,4].includes(numberOfExercises)) {
          exerciseDeclination = "ćwiczenia"
      } else {
        exerciseDeclination = "ćwiczeń"
      }

      return `Kategoria | ${numberOfExercises} ${exerciseDeclination}`
    }
    }
  }
</script>

<style lang="scss" scoped>

.family-tab {
  padding: .5rem 0;
}

.family-tab__name {
  color: white;
  margin: 0;
}

.link {
  flex-basis: 100%;
  text-align: left;
}
</style>