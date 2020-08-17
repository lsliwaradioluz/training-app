<template>
  <nav class="nav" >
    <div class="nav__container container">
      <h1 class="nav__logo">piti</h1>
      <transition name="slide-to-right">
        <section class="nav__menu" ref="nav">
          <ul class="nav__menu__buttons" @click="scrollTo">
            <li class="nav__menu__button">
              <a data-destination="howto">Jak zacząć</a>
            </li>
            <!-- <li class="nav__menu__button">
              <a data-destination="philosophy">Filozofia</a>
            </li> -->
            <li class="nav__menu__button">
              <a data-destination="author">O autorze</a>
            </li>
            <!-- <li class="nav__menu__button">
              <a data-destination="technologies">Technologie</a>
            </li> -->
            <li class="nav__menu__button">
              <a data-destination="contact">Kontakt</a>
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
      <div class="nav__button container" ref="navButton">
        <button
          class="flaticon-menu"
          @click="showMenu"
        ></button>
      </div>
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
      
      this.toggleNavigation()
    },
    toggleNavigation() {
      const navigation = this.$refs.nav
      const navButton = this.$refs.navButton
      navigation.classList.toggle("nav__menu--visible");
      navButton.classList.toggle("nav__button--open")
    },
    scrollTo() {
      if (event.target.nodeName != 'A') {
        return 
      }
      const targetName = event.target.dataset.destination;
      this.$emit("scroll", targetName)
      this.toggleNavigation()
    },
  },
}
</script>

<style lang="scss" scoped>
.nav {
  position: absolute;
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
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
  button {
    font-size: 25px;
    cursor: pointer;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      top: -8px;
      left: -13px;
      background: #FF8000;
      width: 50px;
      height: 50px;
      border-radius: 50px;
      z-index: -1;
      transition: transform .7s;
    }
  }
}

.nav__button--open {
  button:after {
    opacity: 1;
    transform: scale(50);
  }
}

.nav__menu {
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 80%;
  color: #FFF9EB;
  overflow: hidden;
  padding-top: 30%;
  transform: translateX(-100%);
  z-index: 2;
}

.nav__menu--visible {
  transform: translateX(0);
}

.nav__menu__buttons {
  display: flex;
  flex-direction: column;
}

.nav__menu__button {
  padding: 0.3rem 1.2rem;
  display: flex;
  align-items: center;
  transition: opacity 0.3s;
  border-left: none;
  font-size: 20px;
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

</style>
