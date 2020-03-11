<template>
  <div class="trainee">
    <UserPanel :user="user" />
    <!-- <Skills :skill-data="user.skill" v-if="user.skill" editor /> -->
  <!-- TRENINGI  -->
    <div>
      <Head>
        <div class="row j-between a-center">
          <h3 class="m00">Treningi</h3>
          <div>
            <!-- <nuxt-link class="flaticon-list" to="workouts" tag="i" append></nuxt-link> -->
            <nuxt-link
              class="flaticon-plus" 
              :to="{ path: '/workouts/new', query: { username: user.username } }" 
              tag="i"></nuxt-link>
          </div>
        </div>
      </Head>
      <div>
        <Workout :workout="user.homeworks[0]" v-if="user.homeworks.length > 0" />
        <Workout v-for="workout in user.workouts" :key="workout.id" :workout="workout" />
      </div>
      <p class="tab" v-if="user.workouts.length == 0 && user.homeworks.length == 0">
        Brak treningów do wyświetlenia
      </p>
      <!-- <Carousel v-if="user.workouts.length > 0" :pagination="false">
        <Workout v-for="workout in user.workouts" :key="workout.id" :workout="workout" />
      </Carousel>
      <p class="tab p11" v-else>
        Brak treningów do wyświetlenia
      </p> -->
    </div>
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
    return client.query({ query: mainQuery, variables: { username: context.route.params.name } })
      .then(({ data }) => {
        return {
          user: data.users[0]
        }
      });
  },
}
</script>