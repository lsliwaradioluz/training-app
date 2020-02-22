<template>
  <div class="trainee main">
    <UserPanel :user="user" />
    <Skills :skillset="user.skill" v-if="user.skill" ref="skills" editor/>
  <!-- TRENINGI  -->
    <div>
      <Head>
        <div class="row j-between a-center">
          <h3 class="m00">Treningi</h3>
          <div>
            <nuxt-link class="flaticon-list" to="workouts" tag="i" append></nuxt-link>
            <nuxt-link
              class="flaticon-plus" 
              :to="{ path: '/workouts/new', query: { username: user.username } }" 
              tag="i"></nuxt-link>
          </div>
        </div>
      </Head>
      <Carousel v-if="user.workouts.length > 0" :pagination="false">
        <Workout v-for="workout in user.workouts" :key="workout.id" :workout="workout" />
      </Carousel>
      <p class="tab p11" v-else>
        Brak treningów do wyświetlenia
      </p>
    </div>
  <!-- FEEDBACKI -->
    <Head>Feedback</Head>
    <Carousel :pagination="false" v-if="user.feedbacks.length > 0">
      <div class="tab" v-for="feedback in user.feedbacks" :key="feedback.id">
        <h3 class="m00">{{ feedback.scheduled | reverseDate }}</h3>
        <p class="m00 t-small">{{ feedback.feedback }}</p>
      </div>
    </Carousel>
    <p class="tab p11" v-else>
      Ten użytkownik jeszcze nie wysłał żadnej wiadomości.
    </p>
  </div>
</template>

<script>
import createSkill from '~/apollo/mutations/createSkill.gql';
import mainQuery from '~/apollo/queries/users/_name/main.gql';
import Skills from '~/components/Skills.vue';

export default {
  components: {
    Skills,
  },
  asyncData(context) {
    let client = context.app.apolloProvider.defaultClient;
    return client.query({ query: mainQuery, variables: { username: context.route.params.username } })
      .then(({ data }) => {
        return {
          user: data.users[0]
        }
      });
  },
}
</script>