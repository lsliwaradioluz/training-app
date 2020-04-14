<template>
  <nav class="navigation" role="navigation">
    <div class="row j-between a-center">
      <button @click="$router.go(-1)">
        <i class="flaticon-left-arrow mr05 t-faded"></i>
      </button> 
      <!-- <h4 class="navigation__header">{{ header | englishToPolish }}</h4> -->
    </div>
    <!-- side navigation -->
    <div class="navigation__links" v-if="!isAssistant">
      <WorkoutPairingTab v-if="$store.state.main.workoutToPair && $route.path.includes('users') &&!$route.params.id" />
      <WorkoutCopyingTab v-if="$store.state.main.workoutToCopy && $route.path.includes('users') &&!$route.params.id" />
      <div class="row">
        <nuxt-link tag="button" to="/dashboard">
          <i class="flaticon-home"></i>
        </nuxt-link>
        <nuxt-link tag="button" to="/exercises" v-if="user && user.admin">
          <i class="flaticon-gymnast"></i>
        </nuxt-link>
        <nuxt-link tag="button" to="/workouts">
          <i class="flaticon-menu"></i>
        </nuxt-link>
        <nuxt-link tag="button" to="/users" v-if="user && user.admin">
          <i class="flaticon-user-1"></i>
        </nuxt-link>
        <nuxt-link tag="button" to="/settings">
          <i class="flaticon-settings"></i>
        </nuxt-link>
        <nuxt-link tag="button" to="/login" @click.native="$store.commit('auth/logout')">
          <i class="flaticon-logout"></i>
        </nuxt-link>
      </div>
    </div>
    <!-- pull to refresh for ios -->
    <PullToRefresh />
  </nav>
</template>

<script>
import { mapMutations } from 'vuex'
import PullToRefresh from '~/components/PullToRefresh';

export default {
  components: {
    PullToRefresh,
  },
  props: {
    transparent: {
      type: Boolean, 
      default: () => false,
    }
  },
  data() {
    return {
      navToggled: false,
      scroll: 0,
    }
  },
  watch: {
    route() {
      this.navToggled = false;
    }
  },
  computed: {
    route() {
      return this.$route;
    },
    isAssistant() {
      return this.$store.state.assistant.showWorkoutAssistant;
    },
    user() {
      return this.$store.state.auth.user;
    }, 
    backgroundImage() {
      return this.user.image ? this.user.image.url : require('assets/images/user.svg');
    },
    header() {
      if (this.$route.name) {
        return this.$route.name.split('-')[0];
      } else {
        return '';
      }
    }
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

  .navigation__header {
    margin: 0;
    color: white;
    &:first-letter {
      text-transform: uppercase;
      font-weight: 400;
    }
  }

  .navigation__links {
    position: fixed; 
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: color(secondary);
    color: color(faded);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.205);
    button {
      padding-top: 1rem;
      padding-bottom: 1rem;
      text-align: center;
      width: 20%;
      i {
        font-weight: 600;
        font-size: 16px;
      }
    }
  }

  .nuxt-link-active {
    color: color(headers);
  }
</style>