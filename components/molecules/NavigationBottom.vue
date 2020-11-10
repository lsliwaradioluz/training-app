<template>
  <nav class="navigation-bottom">
    <ul class="buttons">
      <NavButton
        v-for="(button, index) in buttons"
        :key="index"
        v-bind="setButtonProps(button.icon, button.destination)"
      />
      <NavButton
        v-bind="setButtonProps('logout', 'login')"
        @click.native="logout"
      />
    </ul>
  </nav>
</template>

<script>
import NavButton from "../atoms/NavigationBottomButton";

export default {
  components: { NavButton },
  computed: {
    buttons() {
      const buttons = [
        { icon: "home", destination: "dashboard" },
        { icon: "gymnast", destination: "exercises" },
        { icon: "menu", destination: "workouts" },
        { icon: "settings", destination: "settings" },
      ];

      if (this.admin) {
        const usersButton = {
          icon: "user",
          destination: "users",
        };
        const usersButtonIndex = buttons.length - 1;
        buttons.splice(usersButtonIndex, 0, usersButton);
      }

      return buttons;
    },
    admin() {
      return this.$store.getters["auth/admin"];
    },
  },
  methods: {
    logout() {
      return this.$store.commit("auth/logout");
    },
    setButtonProps(icon, destination) {
      return {
        icon,
        destination,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.buttons {
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
}

@media (min-width: 450px) {
  .buttons {
    bottom: 10vh;
    left: calc(50vw - 450px / 2);
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    border: 4px solid black;
    border-top: none;
  }
}
</style>
