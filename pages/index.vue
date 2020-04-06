<template>
  <div class="website">
  <!-- NAV -->
    <nav class="row j-between" :class="{ 'nav-triggered': scroll > 0 }">
      <nuxt-link class="logo" tag="span" to="/">Piti</nuxt-link>
      <i class="flaticon-menu navigation__trigger" @click="navToggled = !navToggled"></i>
      <transition name="slide-to-right">
        <div class="navigation-background" v-if="navToggled"></div>
      </transition>
      <transition name="fade">
        <ul class="navigation-links" v-if="navToggled">
          <li>
            <nuxt-link to="login" append>
              <i class="flaticon-user"></i>
              Zaloguj się
            </nuxt-link>
          </li>
          <li>
            <nuxt-link to="register-coach" append>
              <i class="flaticon-3d"></i>
              Zarejestruj się
            </nuxt-link>
          </li>
        </ul>
      </transition>
    </nav>
  <!-- HERO -->
    <section class="hero main">
      <h1 class="mb1 mt2">Online coaching made simple.</h1>
      <p>Z aplikacją Piti prowadzenie treningów personalnych to czysta przyjemność. Stwórz swój profil i podaruj podopiecznym klucz do świetnej formy.</p>
      <nuxt-link class="button--primary" to="register-coach" append>Dołącz do nas</nuxt-link>
    </section>
  <!-- STEPS  -->
    <section class="steps main">
      <h2>Mała aplikacja, wielkie możliwości</h2>
      <div class="row a-center mb1">
        <h2 class="m00 mr05">1</h2>
        <p class="m00">Zakładaj konta swoim podopiecznym przypisane tylko do Ciebie. Tylko Ty będziesz miał do nich dostęp.</p>
      </div>
      <div class="row a-center mb1">
        <h2 class="m00 mr05">2</h2>
        <p class="m00">Twórz treningi szybko i prosto, korzystając z gotowych elementów.</p>
      </div>
      <div class="row a-center mb1">
        <h2 class="m00 mr05">3</h2>
        <p class="m00">Korzystaj z gotowej bazy ponad 100 ćwiczeń opatrzonych animacjami. Możesz też dodawać swoje!</p>
      </div>
    </section>
  <!-- FOOTER -->
    <footer class="p11">
      <h3 class="logo fs-48 t-center mt1 mb0">Piti</h3>
      <p class="t-center fs-12 mt05 mb0">Skontaktuj się z nami</p>
      <span class="row j-around pt15 pb15">
        <span class="icon-box">
          <i class="flaticon-email"></i>
        </span>
        <a href="tel: 784184075" class="icon-box">
          <i class="flaticon-call"></i>
        </a>
        <a href="https://www.facebook.com/hesstudiopersonalne" target="_blank" class="icon-box">
          <i class="flaticon-facebook-logo"></i>
        </a>
      </span>
      <p class="m00 t-center fs-12">Created with ❤️ in {{ new Date().getFullYear() }} by Łukasz Śliwa</p>
    </footer>
  </div>
</template>

<script>
  export default {
    layout: 'website',
    data() {
      return {
        navToggled: false,
        scroll: null,
      }
    },
    mounted() {
      this.scroll = window.scrollY;
      window.addEventListener('scroll', () => {
        this.scroll = window.scrollY;
      });
    }
  }
</script>

<style lang="scss" scoped>

  nav {
    position: fixed;
    background-color: color(lightblack);
    top: 0;
    left: 0;
    width: 100%;
    padding: 1rem;
    transition: box-shadow 0.3s;
  }

  .nav-triggered {
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.644);
  }

  .navigation__trigger {
    z-index: 1000;
  }

  .navigation-background {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background-color: color(lightblack);
  }

  .navigation-links {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    padding: 5rem 1rem;

    li {
      border-left: 0;
      padding: 0;
      padding-bottom: 0.5rem;
      font-size: 1rem;
      i {
        margin-right: 0.5rem;
      }
    }
  }

  .hero {
    padding-bottom: 40%; 
    background-image: url('~assets/images/vectorpaint.png');
    background-size: cover;
    background-position: right center;

    a {
      display: inline-block;
    }
  }
  
  .steps {
    padding-top: 1rem;
  }

  footer {
    border-top-right-radius: 35px 35px;
    border-top-left-radius: 35px;
    background-color: color(lightblack);
  }

  .icon-box i {
    font-size: 16px;
  }
</style>

