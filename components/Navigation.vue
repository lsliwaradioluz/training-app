<template>
  <div class="navigation main pt1 pb1 row j-center a-center">
    <span class="logo">Piti</span>
    <h3 class="m00 t-center">{{ header | englishToPolish }}</h3>
    <span class="hamburger t-right">
      <i class="flaticon-menu" @click="toggleNav"></i>
    </span>
    <div class="navigation__panel b-lightblack" ref="panel">
      <UserTab :user="$store.state.auth.user" style="box-shadow: none;" />
      <div class="navigation__links column tab p11 pt0">
        <nuxt-link to="/dashboard" @click.native="toggleNav">
          <i class="flaticon-user mr05"></i>
          Pulpit
          <i class="flaticon-chevron"></i>
        </nuxt-link>
        <nuxt-link to="/exercises" @click.native="toggleNav" v-if="user.admin">
          <i class="flaticon-gymnastics mr05"></i>
          Ćwiczenia
          <i class="flaticon-chevron"></i>
        </nuxt-link>
        <nuxt-link to="/workouts" @click.native="toggleNav">
          <i class="flaticon-contract mr05"></i>
          Treningi
          <i class="flaticon-chevron"></i>
        </nuxt-link>
        <nuxt-link to="/users" @click.native="toggleNav" v-if="user.admin">
          <i class="flaticon-group mr05"></i>
          Podopieczni
          <i class="flaticon-chevron"></i>
        </nuxt-link>
        <nuxt-link to="/login" @click.native="logout">
          <i class="flaticon-power-button mr05"></i>
          Wyloguj
          <i class="flaticon-chevron"></i>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  computed: {
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
    toggleNav() {
      this.$refs.panel.classList.toggle('toggled');
    },
    ...mapMutations({
      logout: 'auth/logout'
    })
  }
}
</script>

<style lang="scss" scoped>
  
  .navigation {
    width: 100%;
    background-color: color(black);
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
      padding: 0.5rem 0;
      display: flex;
      position: relative;
      border-bottom: 1px solid color(black);

      &:last-child {
        border: none;
      }

      .flaticon-chevron {
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