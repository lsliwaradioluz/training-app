<template>
  <div class="workouts main t-white">
    <div v-for="workout in workouts" :key="workout.id">
      <div v-for="(complex, index) in workout.strength">
        <p>Kompleks {{ index + 1 }}</p>
        <div v-for="exercise in complex.exercises">{{ exercise.exercise }}: {{ exercise.sets }} x {{ exercise.reps }}</div>
      </div>
    </div>
    <!-- <div v-for="(exercise, index) in workout" :key="`exercise${index}`">{{ exercise.name }}: {{ exercise.reps }}</div> -->
  </div>
</template>

<script>
export default {
  props: ['workouts'], 
  // computed: {
  //   workout() {
  //     const workout = [];
  //     this.workouts[0].complex.forEach((cur, index) => {
  //       const exercises = [];
  //       for(let x = 0; x < cur.sets; x++) {
  //         exercises.push({ name: cur.exercise, reps: cur.reps });
  //       }
  //       workout.push(exercises);
  //     });
  //     const sortedWorkout = workout.sort((a, b) => {
  //       return b.length - a.length
  //     });
  //     const zippedWorkout = _.zip(...sortedWorkout);
  //     const flattenedWorkout = _.flattenDeep(zippedWorkout);
  //     const filteredWorkout = flattenedWorkout.filter(element => {
  //       return element != null;
  //     });

  //     for (let i = 0; i <= filteredWorkout.length; i++) {
  //       if (i % 2 != 0) {
  //         filteredWorkout.splice(i, 0, { name: 'rest', reps: 90 });
  //       }
  //     }

  //     return filteredWorkout;
  //   }
  // }
}
</script>