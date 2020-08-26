<template>
  <nav class="navigation" role="navigation">
    <ul class="navigation__buttons row j-between a-center">
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
        />
      </li>
    </ul>
    <ul class="links">
      <nuxt-link class="link flaticon-home" tag="li" to="/dashboard">
        <p class="link__text">Strona główna</p>
      </nuxt-link>
      <nuxt-link class="link flaticon-gymnast" tag="li" to="/exercises" v-if="admin">
        <p class="link__text">Baza ćwiczeń</p>
      </nuxt-link>
      <nuxt-link class="link flaticon-menu" tag="li" to="/workouts">
        <p class="link__text">Twoje treningi</p>
      </nuxt-link>
      <nuxt-link
        v-if="admin"
        class="link flaticon-user"
        tag="li"
        to="/users"
      >
        <p class="link__text">Podopieczni</p>
      </nuxt-link>
      <nuxt-link class="link flaticon-settings" tag="li" to="/settings">
        <p class="link__text">Ustawienia</p>
      </nuxt-link>
      <nuxt-link
        class="link flaticon-logout"
        tag="li"
        to="/login"
        @click.native="$store.commit('auth/logout')"
      >
        <p class="link__text">Wyloguj się</p>
      </nuxt-link>
    </ul>
    <Modal :show="showCopyPair" @close="showCopyPair = false">
      <div class="copy-pair">
        <p v-if="workoutToPair" class="row j-between">
          Parujesz z {{ workoutToPair.user.username }}
          {{ workoutToPair.scheduled | reverseDate }}
          <button
            class="flaticon-cancel fs-12"
            type="button"
            @click="stopPairWorkout"
          />
        </p>
        <p v-if="workoutToCopy" class="row j-between">
          Kopiujesz {{ workoutToCopy.user.username }}
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
    admin() {
      return this.$store.getters["auth/admin"]
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
      this.$store.dispatch("main/removeEntryFromDb", 'workoutToPair')
    },
    stopCopyWorkout() {
      if (!this.workoutToPair) this.showCopyPair = false
      this.$store.dispatch("main/removeEntryFromDb", 'workoutToCopy')
    },
  },
}
</script>

<style lang="scss" scoped>
.navigation {
  li {
    border: none;
    padding-left: 0;
  }
}

.navigation__buttons {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  padding: 1rem;
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
  display: flex;
  justify-content: space-between;
  max-width: 450px;
  z-index: 1000;
  padding: 0;
}

.link {
  padding: 1rem 0;
  text-align: center;
  width: 20%;
  font-size: 16px;
  font-weight: 600;
}

.link__text {
  display: none;
}

.nuxt-link-active {
  color: color(headers);
}

@media (min-width: 450px) {
  .links {
    bottom: 10vh;
    left: calc(50vw - 450px/2);
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    border: 4px solid black;
    border-top: none;
  }
}
</style>
