<template>
  <div class="workout-panel row j-between a-center">
    <div class="row">
      <div class="avatar mr05" :style="{ backgroundImage: `url('${workout.user.image ? workout.user.image.url : require('assets/images/user.svg')}')` }"></div>
      <div class="column a-start">
        <div v-if="!$store.state.auth.user.admin">
          <h4 class="m00" v-if="workout.sticky">Podwieszony</h4>
          <h4 class="m00" v-else>{{ workout.scheduled | reverseDate }}</h4>
          <p class="m00 fs-12 faded" v-if="workout.sticky">dodano {{ workout.createdAt | reverseDate }}</p>
          <p class="m00 fs-12 faded" v-else>{{ workout.scheduled | getDayName }} {{ workout.scheduled | getTime }}</p>
        </div>
        <div v-else>
          <h4 class="m00">{{ workout.user.fullname }}</h4>
          <p class="m00 fs-12 faded" v-if="workout.sticky">Podwieszony</p>
          <p class="m00 fs-12 faded" v-else>{{ workout.scheduled | reverseDate }}</p>
        </div>
      </div>
    </div>
    <ContextMenu>
      <template v-slot:trigger>
        <i class="flaticon-vertical-dots"></i>
      </template>
      <template v-slot:options>
        <button
          type="button" 
          @click="$emit('show-assistant')">
          <i class="flaticon-play-and-pause-button"></i>
          Włącz asystenta
        </button>
        <nuxt-link 
          type="button" 
          tag="button"
          to="/users"
          @click.native="pairWorkout"
          v-if="$store.state.auth.user.admin">
          <i class="flaticon-double-arrow-cross-of-shuffle"></i>
          Paruj
        </nuxt-link>
        <button
          type="button" 
          @click="$emit('edit-score')">
          <i class="flaticon-writing"></i>
          Dodaj wyniki
        </button>
      </template>
    </ContextMenu>
  </div>
</template>

<script>

  export default {
    props: ['workout'], 
    data() {
      return {
        showButton: false,
      }
    }, 
    methods: {
      pairWorkout() {
        const workoutToPair = {
          id: this.workout.id,
          user: this.workout.user.username, 
          scheduled: this.workout.scheduled
        }
        this.$store.commit('main/pairWorkout', workoutToPair);
      }
    }
  }
</script>

<style lang="scss" scoped>

  .workout-panel {
    padding-bottom: .5rem;
    border-bottom: 1px solid #74B9F5;
    margin-bottom: 1rem;
  }

  .border-top {
    padding-top: .5rem;
    border-top: 1px solid #74B9F5;
  }
</style>