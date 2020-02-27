<template>
  <div class="workout">
    <div class="workout__buttons row j-around mb05" v-if="workouts.length > 1">
      <button 
        type="button"
        class="t-small"
        :class="{ 't-green': index == currentWorkout }"
        v-for="(date, index) in users" 
        :key="index"
        @click="currentWorkout = index">{{ date | reverseDate }}</button>
    </div>
    <div>
    <!-- NAGŁÓWEK -->
      <WorkoutPanel :workout="workout" />
    <!-- ROZPISKA  --> 
      <Head class="mt0 pt05 pb05">
        <div class="row j-between">
          <span>Rozpiska</span>
          <nuxt-link 
            class="flaticon-play" 
            tag="i" 
            :to="{ path: 'assistant', query: { section: currentTranslate } }" 
            append></nuxt-link>
        </div>
      </Head>
      <Carousel :pagination="false" @change-page="currentTranslate = $event">
        <Routine 
          v-for="section in workout.sections" 
          :key="section.id" 
          :section="section" />
      </Carousel>
    <!-- FEEDBACK -->
      <!-- <div v-if="feedbackEditable && !workout.sticky">
        <Head class="mt0 pt05 pb05">Wiadomość dla trenera</Head>
        <Feedback :workout="workout" />
      </div>
      <div v-else-if="!workout.sticky && !feedbackEditable && workout.feedback">
        <Head class="mt0 pt05 pb05">Wiadomość dla trenera</Head>
        <p class="m00 tab">{{ workout.feedback }}</p>
      </div>
      <div v-else-if="!workout.sticky && !feedbackEditable && !workout.feedback">
        <Head class="mt0 pt05 pb05">Wiadomość dla trenera</Head>
        <p class="m00 tab">Użytkownik nie dodał wiadomości</p>
      </div> -->
    </div>
  </div>
</template>

<script>
  import mainQuery from '~/apollo/queries/workouts/_id/main.gql';

  export default {
    asyncData(context) {
      let client = context.app.apolloProvider.defaultClient;
      let IDs;
      if (context.store.state.main.workoutToPair) {
        IDs = [context.route.params.id, context.store.state.main.workoutToPair.id];
      } else {
        IDs = [context.route.params.id];
      }
      return client.query({ query: mainQuery, variables: { ids: IDs } })
        .then(({ data }) => {
          return {
            workouts: data.workouts,
          }
        });
    },
    data() {
      return {
        currentTranslate: 0,
        currentWorkout: 0,
      }
    },
    computed: {
      workout() {
        return this.workouts[this.currentWorkout];
      },
      users() {
        let users = [];
        this.workouts.forEach(cur => {
          users.push(cur.user.username);
        });
        return users;
      },
      feedbackEditable() {
        return this.$store.state.auth.user.fullname == this.workout.user.fullname ? true : false;
      },
    }
  }
</script>
