<template>
  <div class="navigation main pt1 pb1 row j-center a-center" :class="{ 'b-black': !transparent && !isAssistant }">
    <PullToRefresh />
    <nuxt-link class="logo" tag="span" to="/">Piti</nuxt-link>
    <h3 class="m00 t-center" v-if="!isAssistant">{{ header | englishToPolish }}</h3>
    <h3 class="m00 t-center" v-else>Asystent</h3>
    <span class="t-right">
      <i class="flaticon-menu" @click="navToggled = !navToggled" v-if="!isAssistant"></i>
      <span v-else>
        <i class="flaticon-cancel small" @click="$store.commit('assistant/toggleWorkoutAssistant')" v-if="!$store.state.assistant.showBlockDescription"></i>
        <i class="flaticon-cancel small" @click="$store.commit('assistant/toggleBlockDescription')" v-else></i>
      </span>
    </span>
    <div class="navigation__panel b-lightblack" :class="{ toggled: navToggled }" ref="panel">
      <UserTab :user="$store.state.auth.user" style="box-shadow: none;" />
      <div class="navigation__links column tab p11 pt0">
        <nuxt-link to="/dashboard">
          <i class="flaticon-user mr05"></i>
          Pulpit
          <i class="flaticon-right-arrow"></i>
        </nuxt-link>
        <nuxt-link to="/exercises" v-if="user.admin">
          <i class="flaticon-gymnastics mr05"></i>
          Ćwiczenia
          <i class="flaticon-right-arrow"></i>
        </nuxt-link>
        <nuxt-link to="/workouts">
          <i class="flaticon-contract mr05"></i>
          Treningi
          <i class="flaticon-right-arrow"></i>
        </nuxt-link>
        <nuxt-link to="/users" v-if="user.admin">
          <i class="flaticon-group mr05"></i>
          Podopieczni
          <i class="flaticon-right-arrow"></i>
        </nuxt-link>
        <nuxt-link to="/login" @click.native="logout">
          <i class="flaticon-off-button mr05"></i>
          Wyloguj
          <i class="flaticon-right-arrow"></i>
        </nuxt-link>
      </div>
    </div>
  </div>
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
      return this.$store.getters['auth/user']
    }, 
    header() {
      if (this.$route.name) {
        return this.$route.name.split('-')[0];
      } else {
        return '';
      }
      
    }
  }, 
  methods: {
    ...mapMutations({
      logout: 'auth/logout'
    })
  }, 
  mounted() {
    window.addEventListener('click', () => {
      if (!event.target.classList.contains('flaticon-menu')) {
        this.navToggled = false;
      }
    });
  }
}
</script>

<style lang="scss" scoped>
  
  .navigation {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;

    span {
      width: 20%;
    }
    h3 {
      text-transform: capitalize;
      width: 60%;
    }
  }

  .navigation__panel {
    position: fixed; 
    top: 0;
    left: 0;
    height: 100vh; 
    width: 85%;
    z-index: 1001;
    transform: translateX(-100%);
    transition: all 0.3s cubic-bezier(1, 0.5, 0.5, 0.75);
    border-right: 0.5px solid color(inputgray);
  }

  .navigation__links  {
    box-shadow: none;

    a {
      padding: 1rem 0 0.5rem 0;
      display: flex;
      align-items: center;
      position: relative;
      border-bottom: 1px solid color(black);
      margin: 0;

      &:last-child {
        border: none;
      }

      .flaticon-right-arrow {
        position: absolute;
        right: 0;
        font-size: 9px;

        &::before {
          font-size: 8px;
          color: color(green);
        }
      }
    }
  }

  .toggled {
    transform: translateX(0);
  }
</style>