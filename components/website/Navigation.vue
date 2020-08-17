<template>
  <nav class="nav">
    <div class="nav__container container">
      <h1 class="nav__logo">piti</h1>
      <transition name="slide-to-right">
        <section class="nav__menu" ref="nav">
          <ul class="nav__menu__buttons">
            <li class="nav__menu__button">
              <nuxt-link to="register-coach">Jak zacząć</nuxt-link>
            </li>
            <li class="nav__menu__button">
              <nuxt-link to="login">Filozofia</nuxt-link>
            </li>
            <li class="nav__menu__button">
              <nuxt-link to="register-coach">O autorze</nuxt-link>
            </li>
            <li class="nav__menu__button">
              <nuxt-link to="register-coach">Technologie</nuxt-link>
            </li>
            <li class="nav__menu__button">
              <nuxt-link to="register-coach">Kontakt</nuxt-link>
            </li>
          </ul>
          <ul class="nav__menu__buttons">
            <li class="nav__menu__button">
              <nuxt-link to="login">Logowanie</nuxt-link>
            </li>
            <li class="nav__menu__button">
              <nuxt-link to="register-coach">Rejestracja</nuxt-link>
            </li>
          </ul>
        </section>
      </transition>
      <button
        class="nav__button flaticon-menu"
        @click="showMenu"
      ></button>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    showMenu() {
      const navigation = this.$refs.nav
      const buttons = []
      
      for (let child of navigation.children) {
        const childButtons = [...child.children]
        buttons.push(...childButtons)
      }

      if (navigation.classList.contains("nav__menu--visible")) {
        buttons.forEach((button, index) => {
          button.style.animation = 'none';
        })
      } else {
        buttons.forEach((button, index) => {
          button.style.animation = 'fade-and-slide-down 1s';
        })
      }

      navigation.classList.toggle("nav__menu--visible");
    }
  }
}
</script>

<style lang="scss" scoped>
.nav {
  position: fixed;
  top: 0;
  padding: 1rem 0;
  z-index: 2;
  width: 100%;
}

.nav__container {
  display: flex;
  justify-content: space-between;
}

.nav__logo,
.nav__menu__header__logo {
  color: white;
  font-weight: 600;
  font-size: 40px;
  letter-spacing: 1px;
  text-transform: capitalize;
  margin: 0;
  line-height: 45px;
  height: 45px;
}

.nav__button {
  font-size: 25px;
  cursor: pointer;
}

.nav__menu {
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 80%;
  background-color: #FFF9EB;
  color: #FF8000;
  overflow: hidden;
  padding-top: 1rem;
  transform: translateX(-100%);
  transition: transform 0.3s;
}

.nav__menu--visible {
  transform: translateX(0);
}

.nav__menu__buttons {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.nav__menu__button {
  padding: 0.3rem 1.2rem;
  display: flex;
  align-items: center;
  transition: opacity 0.3s;
  border-left: none;
  font-size: 18px;
  &:hover,
  &:active {
    opacity: 0.6;
  }
}

@media (min-width: 1024px) {
  .nav__menu {
    background-color: initial;
    transform: translateX(0);
    flex-direction: row;
    justify-content: flex-end;
    height: auto;
    position: static;
    padding-top: 0;
    width: 100%;
    color: #FFF9EB;
  }

  .nav__menu__buttons {
    flex-direction: row;
    margin-top: 0;
    margin-left: 3rem;
  }
  
  .nav__menu__button {
    font-size: 17px;
  }

  .nav__button {
    display: none;
  }
}

// #ffae00
// #f2eada
// #ff7f00

</style>
