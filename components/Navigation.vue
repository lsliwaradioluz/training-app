<template>
  <nav class="navigation" role="navigation">
    <ul class="row j-between a-center">
      <li>
        <button
          class="flaticon-left-arrow-2 mr05 t-faded"
          @click="$router.go(-1)"
        />
      </li>
      <li class="row">
        <button class="flaticon-continuous t-faded" @click="reloadPage" />
        <button
          v-if="
            $store.state.main.workoutToPair || $store.state.main.workoutToCopy
          "
          class="flaticon-bell copy-pair-icon t-headers ml05"
          @click="showCopyPair = !showCopyPair"
        >
          >
        </button>
      </li>
    </ul>
    <ul class="links row j-between">
      <nuxt-link class="flaticon-home" tag="li" to="/dashboard" />
      <nuxt-link class="flaticon-gymnast" tag="li" to="/exercises" />
      <nuxt-link class="flaticon-menu" tag="li" to="/workouts" />
      <nuxt-link
        v-if="user && user.admin"
        class="flaticon-user"
        tag="li"
        to="/users"
      />
      <nuxt-link class="flaticon-settings" tag="li" to="/settings" />
      <nuxt-link
        class="flaticon-logout"
        tag="li"
        to="/login"
        @click.native="$store.commit('auth/logout')"
      />
    </ul>
    <Modal :show="showCopyPair" @close="showCopyPair = false">
      <div class="copy-pair">
        <p v-if="workoutToPair" class="row j-between">
          Parujesz z {{ workoutToPair.user }}
          {{ workoutToPair.scheduled | reverseDate }}
          <button
            class="flaticon-cancel fs-12"
            type="button"
            @click="stopPairWorkout"
          />
        </p>
        <p v-if="workoutToCopy" class="row j-between">
          Kopiujesz {{ workoutToCopy.user }}
          {{ workoutToCopy.scheduled | reverseDate }}
          <button
            class="flaticon-cancel fs-12"
            type="button"
            @click="stopCopyWorkout"
          />
        </p>
      </div>
    </Modal>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      showCopyPair: false,
    }
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"]
    },
    workoutToPair() {
      return this.$store.state.main.workoutToPair
    },
    workoutToCopy() {
      return this.$store.state.main.workoutToCopy
    },
  },
  methods: {
    reloadPage() {
      window.location.reload()
    },
    stopPairWorkout() {
      if (!this.workoutToCopy) this.showCopyPair = false
      this.$store.commit("main/stopPairWorkout")
    },
    stopCopyWorkout() {
      if (!this.workoutToPair) this.showCopyPair = false
      this.$store.commit("main/stopCopyWorkout")
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
  li {
    border: none;
    padding-left: 0;
  }
}

.copy-pair-icon {
  z-index: 1004;
}

.copy-pair {
  position: absolute;
  top: 3.5rem;
  right: 0;
  padding: 0 1rem;
  width: 100%;
  p {
    position: relative;
    width: 100%;
    padding: 0.5rem;
    color: color(primary);
    background-color: color(headers);
  }
}

.links {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: color(secondary);
  color: color(faded);
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.466);
  li {
    padding: 1rem 0;
    text-align: center;
    width: 20%;
    font-size: 16px;
    font-weight: 600;
  }
}

@media (min-width: 401px) {
  .links {
    left: initial;
    max-width: 400px;
    margin: 0 auto;
    transform: translateX(-1rem);
    margin-bottom: 5vh;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
}

.nuxt-link-active {
  color: color(headers);
}
</style>
