<template>
  <nav class="navigation" role="navigation">
    <div class="row j-between a-center">
      <button class="flaticon-left-arrow mr05 t-faded" @click="$router.go(-1)"></button> 
    </div>
    <div class="links" v-if="!isAssistant">
      <WorkoutPairingTab v-if="$store.state.main.workoutToPair && $route.path.includes('users') &&!$route.params.id" />
      <WorkoutCopyingTab v-if="$store.state.main.workoutToCopy && $route.path.includes('users') &&!$route.params.id" />
      <div class="row">
        <nuxt-link class="flaticon-home" to="/dashboard"></nuxt-link>
        <nuxt-link class="flaticon-gymnast" to="/exercises" v-if="user && user.admin"></nuxt-link>
        <nuxt-link class="flaticon-menu" to="/workouts"></nuxt-link>
        <nuxt-link class="flaticon-user-1" to="/users" v-if="user && user.admin"></nuxt-link>
        <nuxt-link class="flaticon-settings" to="/settings"></nuxt-link>
        <nuxt-link class="flaticon-logout" to="/login" @click.native="$store.commit('auth/logout')"></nuxt-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  computed: {
    isAssistant() {
      return this.$store.state.assistant.showWorkoutAssistant;
    },
    user() {
      return this.$store.state.auth.user;
    },
  },
}
</script>

<style lang="scss" scoped>

  .navigation {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    padding: 1rem;
  }

  .links {
    position: fixed; 
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: color(secondary);
    color: color(faded);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.753);
    a {
      padding-top: 1rem;
      padding-bottom: 1rem;
      text-align: center;
      width: 20%;
      font-weight: 600;
      font-size: 16px;
    }
  }

  .nuxt-link-active {
    color: color(headers);
  }
</style>