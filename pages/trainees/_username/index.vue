<template>
  <div class="trainee main">
    <UserPanel :user="user" />
    <Head>
      <div class="row j-between">
        <h3 class="m00">Umiejętności</h3>
      </div>
    </Head>
    <Skills :skillset="user.skill" v-if="user.skill" editor/>
    <p class="tab p11" v-else>
      Brak umiejętności do wyświetlenia
    </p>
    <Head>
      <div class="row j-between a-center">
        <h3 class="m00">Treningi</h3>
        <div>
          <nuxt-link to="workouts" tag="span" append>
            <i class="flaticon-list t-black" v-if="user.workouts.length > 0"></i>
          </nuxt-link>
          <nuxt-link :to="{ path: '/workouts/new', query: { username: user.username } }" tag="span">
            <i class="flaticon-plus t-black"></i>
          </nuxt-link>
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
</template>

<script>
import createSkill from '~/apollo/mutations/createSkill.gql';
import mainQuery from '~/apollo/queries/trainees/_username/main.gql';
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