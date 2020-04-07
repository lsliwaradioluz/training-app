<template>
  <nav class="navigation" :class="{ 'b-black': !transparent }">
    <nuxt-link class="logo" tag="span" to="/">Piti</nuxt-link>
    <h3 class="m00 t-center" v-if="!isAssistant">{{ header | englishToPolish }}</h3>
    <h3 class="m00 t-center" v-else>Asystent</h3>
    <span class="t-right">
      <i class="flaticon-menu navigation__trigger" @click="navToggled = !navToggled" v-if="!isAssistant"></i>
      <span v-else>
        <i class="flaticon-cancel small" @click="$store.commit('assistant/toggleWorkoutAssistant')" v-if="!$store.state.assistant.showBlockDescription"></i>
        <i class="flaticon-cancel small" @click="$store.commit('assistant/toggleBlockDescription')" v-else></i>
      </span>
    </span>
    <Modal :show="navToggled" transition="slide-to-right" @close="navToggled = false">
      <div class="navigation__panel b-lightblack pt05" ref="panel">
        <UserTab :user="$store.state.auth.user" style="box-shadow: none;" v-if="user" />
        <div class="navigation__links column pt0">
          <nuxt-link to="/dashboard">
            <i class="flaticon-home"></i>
            Pulpit
            <i class="flaticon-right-arrow"></i>
          </nuxt-link>
          <nuxt-link to="/exercises" v-if="user && user.admin">
            <i class="flaticon-kettlebell"></i>
            Ćwiczenia
            <i class="flaticon-right-arrow"></i>
          </nuxt-link>
          <nuxt-link to="/workouts">
            <i class="flaticon-3d"></i>
            Treningi
            <i class="flaticon-right-arrow"></i>
          </nuxt-link>
          <nuxt-link to="/users" v-if="user && user.admin">
            <i class="flaticon-user"></i>
            Podopieczni
            <i class="flaticon-right-arrow"></i>
          </nuxt-link>
          <nuxt-link to="/settings">
            <i class="flaticon-settings"></i>
            Ustawienia
            <i class="flaticon-right-arrow"></i>
          </nuxt-link>
          <nuxt-link to="/login" @click.native="$store.commit('auth/logout')">
            <i class="flaticon-logout"></i>
            Wyloguj
            <i class="flaticon-right-arrow"></i>
          </nuxt-link>
        </div>
      </div>
    </Modal>
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
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    transition: all 0.3s;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;

    span {
      width: 20%;
    }

    h3:first-letter {
      text-transform: uppercase;
    }
  }

  .navigation__panel {
    position: fixed; 
    top: 0;
    left: 0;
    height: 100vh; 
    width: 85%;
  }

  .navigation__links a {
    padding: 1rem 1rem 0.5rem 1rem;
    display: flex;
    align-items: center;
    position: relative;
    border-bottom: 1px solid color(black);
    margin: 0;
      
    i:first-child {
      margin-right: 0.5rem;
    }

    &:last-child {
      border: none;
    }

    .flaticon-right-arrow {
      position: absolute;
      right: 1rem;
      font-size: 8px;
      color: color(green);
    }
  }
</style>