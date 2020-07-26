<template>
  <div>
    <header class="welcome">
      <nav class="nav main">
        <h1 class="nav__logo">piti</h1>
        <button
          class="nav__button flaticon-menu"
          @click="showMenu = true"
        ></button>
        <transition name="slide-to-right">
          <section class="nav__menu" v-show="showMenu">
            <div class="nav__menu__header">
              <h1 class="nav__menu__header__logo">piti</h1>
              <button
                class="flaticon-cancel"
                type="button"
                @click="showMenu = false"
              ></button>
            </div>
            <button
              class="nav__menu__button"
              type="button"
              data-ref="philosophy"
              @click="scrollTo"
            >
              Filozofia
            </button>
            <button
              class="nav__menu__button"
              type="button"
              data-ref="about"
              @click="scrollTo"
            >
              O nas
            </button>
            <button
              class="nav__menu__button"
              type="button"
              data-ref="coaches"
              @click="scrollTo"
            >
              Trenerzy
            </button>
            <button
              class="nav__menu__button"
              type="button"
              data-ref="app"
              @click="scrollTo"
            >
              Aplikacja
            </button>
            <nuxt-link class="nav__menu__button" tag="button" to="/login">
              Logowanie
            </nuxt-link>
            <button
              class="nav__menu__button"
              type="button"
              data-ref="contact"
              @click="scrollTo"
            >
              Kontakt
            </button>
          </section>
        </transition>
      </nav>
      <h1 class="welcome__header main">
        Wstanie z kanapy to najlepsze ćwiczenie jakie można wykonać.
      </h1>
      <div class="welcome__buttons main">
        <button class="welcome__button" @click="scrollTo" data-ref="philosophy">
          Poznaj nas
          <span class="flaticon-right-arrow-2" />
        </button>
        <nuxt-link class="welcome__button ml15" to="/login">
          Aplikacja
          <span class="flaticon-right-arrow-2" />
        </nuxt-link>
      </div>
    </header>
    <article class="philosophy main" ref="philosophy">
      <h3>Wierzymy w ideę ruchowej diety</h3>
      <p>
        Ciało człowieka potrzebuje ruchu tak samo, jak potrzebuje wody, snu i
        pożywienia. Potrzebuje go codziennie, a nie od święta. W dawkach, które
        dają radość, a nie przyprawiają o zawroty głowy.
      </p>
      <p>
        Nauczymy Cię, jak wykorzystać masę własnego ciała, byś zyskał sprawność
        i mobilność, trenując gdzie chcesz i kiedy chcesz.
      </p>
      <p>
        Pracę z Tobą zaczniemy od zbudowania soldnego fundamentu pod przyszłą
        aktywność. Przywrócimy siłę korpusu i utracone zakresu ruchu, by
        uzyskiwanie efektów przychodziło Ci z łatwością i bez kontuzji.
      </p>
    </article>
    <article class="people main" ref="about">
      <img src="../assets/images/coaches.jpg" alt="trenerzy" />
      <h3 class="people__header">
        Nie zapraszamy Cię do stereotypowej siłowni
      </h3>
      <p>
        Swoją karierę rozpoczęliśmy i związaliśmy z klubem Hes Gym & Fitness,
        który różni się od zalewających rynek sieciówek.
      </p>
      <p>
        U nas nie jesteś anonimowym klientem, tylko częścią społeczności, która
        przetrwała nawet epidemię koronawirusa.
      </p>
      <p>
        Treningi personalne będziesz mógł urozmaicić zajęciami grupowymi, które
        skrócą Twoję drogę do sprawności fizycznej.
      </p>
    </article>
    <article class="coaches main" ref="coaches">
      <img
        class="coaches__image"
        src="../assets/images/coaches2.jpg"
        alt="trenerzy"
      />
      <h3 class="coaches__header">
        Chcemy, być wiedział coś o nas
      </h3>
      <p>
        Zespół Piti tworzą Łukasz i Gabrysia - certyfikowani instruktorzy
        fitness oraz nauczyciele ruchu. Celowo nie używamy określenia "trenerzy
        personalni", bo jakoś źle nam się kojarzy.
      </p>
      <p>
        Swoją przygodę rozpoczęliśmy od zajęć grupowych Les Mills CXWorx™,
        Bodypump™, Bodycombat™ oraz GRIT™, które prowadzimy do dziś.
      </p>
      <p>
        W codziennym treningu wykorzystujemy przede wszystkim elementy
        gimnastyki i Animal Flow. Wierzymy także w skuteczność treningu wysokiej
        intensywności (High Intensity Interval Training, Sprinting Interval
        Training)
      </p>
    </article>
    <article class="app main" ref="app">
      <h3 class="people__header">
        Stworzyliśmy własną aplikację treningową
      </h3>
      <p>
        Chcemy, byś oprócz zajęć z nami trenował samodzielnie. Zaplanujemy dla
        Ciebie zajęcia w aplikacji Piti, którą stworzyliśmy "po godzinach",
        realizując drugą ze swoich pasji - programowanie.
      </p>
      <nuxt-link class="app__button button-primary" to="/login">
        Przejdź do aplikacji
      </nuxt-link>
      <ul class="app__steps mt2 carousel-container">
        <Carousel :navigation-config="carouselNavConfig">
          <li class="app__step" v-for="(step, index) in steps" :key="index">
            <h5 class="app__step__caption">
              Krok {{ index + 1 }}
              <span class="flaticon-right-arrow-2 ml05 fs-12" />
            </h5>
            <h4>{{ step.header }}</h4>
            <p>{{ step.text }}</p>
            <img
              :src="require(`../assets/images/${step.image}`)"
              :alt="`step${index + 1}`"
            />
          </li>
        </Carousel>
      </ul>
    </article>
    <footer class="footer" ref="contact">
      <form class="footer__form main" @submit.prevent>
        <h3 class="footer__form__header">
          Umów się na bezpłatny trening wprowadzający
        </h3>
        <p class="footer__form__text">
          Pierwsze zajęcia z nami są darmowe, abyś mógł się przekonać, jak
          pracujemy. Chcesz zarezerwować termin wizyty lub zadań związane z nią
          pytanie? Skorzystaj z formularza, a skontaktujemy się z Tobą!
        </p>
        <BaseInput
          v-model="formData.email"
          class="mb05"
          placeholder="Twój adres email"
          type="email"
          :show-status="false"
        />
        <BaseTextarea
          v-model="formData.message"
          class="mb2"
          placeholder="Treść wiadomości"
          type="text"
          :rows="5"
          :show-status="false"
        />
        <button class="button-primary" type="button" @click="sendMessage">
          Wyślij
        </button>
      </form>
      <article class="footer__contact main">
        <h3 class="footer__contact__header">Znajdź nas</h3>
        <p>
          Większość naszej pracy zobaczysz na naszym profilu na Instagramie.
          Możesz kontaktować się z nami za jego pośrednictwem lub telefonicznie.
        </p>
        <section class="footer__contact__buttons">
          <a
            class="footer__contact__button flaticon-instagram"
            href="https://www.instagram.com/hes.coach.sliwa/"
            target="_blank"
          >
            <p class="footer__contact__button__text">Instagram</p>
          </a>
          <a
            class="footer__contact__button flaticon-telephone"
            href="tel:+48784184075"
          >
            <p class="footer__contact__button__text">784 184 075</p>
          </a>
          <a
            class="footer__contact__button flaticon-placeholder"
            href="https://goo.gl/maps/Lp75gJ4HZg7nBmxr8"
            target="_blank"
          >
            <p class="footer__contact__button__text">Wielkopolska 72</p>
          </a>
        </section>
        <section class="footer__signature">
          <p class="footer__signature__text">
            Coded by Łukasz Śliwa from Piti. Icons made by Freepik from
            www.flaticon.com
          </p>
        </section>
      </article>
    </footer>
  </div>
</template>

<script>
export default {
  layout: "website",
  data() {
    return {
      steps: [
        {
          header: "Załóż konto",
          image: "sign-up.gif",
          text:
            "Na wybrany adres e-mail prześlemy Ci link do formularza, za pomocą którego założysz swoje konto. Nie będą potrzebne żadne poufne dane.",
        },
        {
          header: "Dodaj do ekranu głównego",
          image: "add-to-main-screen.gif",
          text:
            "Z aplikacji Piti możesz korzystać w przeglądarce lub dodać ją do ekranu głównego. Jej ikona pojawi się wówczas w menu Twojego telefonu.",
        },
        {
          header: "Wybierz trening",
          image: "choose-workout.gif",
          text:
            "Wszystkie ułożone dla Ciebie treningi pojawią się od razu na Twoim smartfonie. Każdy z nich będzie opatrzony datą, a składające się na niego ćwiczenia - zdjęciami.",
        },
        {
          header: "Włącz asystenta",
          image: "use-assistant.gif",
          text:
            "Spoglądasz na rozpiskę i nic nie rozumiesz? Spokojnie! Aplikacja Piti posiada wbudowanego asystenta treningu, który przeprowadzi Cię przez sesję krok po kroku, pokazując ćwiczenia i odmierzając czas.",
        },
        {
          header: "Zostaw feedback",
          image: "add-feedback.gif",
          text:
            "Po zakończonym treningu zostaw feedback dotyczący wykonanych ćwiczeń. Daj znać trenerowi, z czym miałeś problem, co było zbyt łatwe, a co zbyt trudne. Dzięki temu kolejny Wasz trening będzie jeszcze lepiej dopasowany do Twoich potrzeb.",
        },
      ],
      formData: {
        email: null,
        message: null,
      },
      showMenu: false,
    };
  },
  computed: {
    carouselNavConfig() {
      return {
        height: "2px",
        margin: "0",
        borderRadius: "0",
        activeColor: "#FDDCBD",
        fullWidth: true,
      };
    },
  },
  methods: {
    scrollTo() {
      const reference = event.target.dataset.ref;
      this.$refs[reference].scrollIntoView({ behavior: "smooth" });
      this.showMenu = false;
    },
    sendMessage() {
      const endpoint =
        process.env.NODE_ENV == "development"
          ? "http://localhost:1337/email"
          : "https://piti-backend.herokuapp.com/email";
      this.$axios
        .$post(endpoint, {
          from: this.formData.email,
          to: "hestreningipersonalne@gmail.com",
          subject: "Nowa wiadomość z formularza kontaktowego",
          text: this.formData.message,
        })
        .then(() => {
          this.$store.commit(
            "main/setNotification",
            "Wiadomość została wysłana!"
          );
          this.formData.email = null;
          this.formData.message = null;
        })
        .catch(() => {
          this.$store.commit(
            "main/setNotification",
            "Wystąpił błąd. Na pewno wpisałeś dobry email?"
          );
        });
    },
  },
};
</script>

<style lang="scss" scoped>
h3,
h4,
h5 {
  color: black;
  font-weight: 400;
  letter-spacing: 1px;
}

ul {
  list-style: none;
}

p,
li {
  font-family: "Work Sans", sans-serif;
  font-weight: 400;
  color: black;
  border-left: none;
  padding-left: 0;
}

img {
  width: 100%;
}

.nav {
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  justify-content: space-between;
}

.nav__logo,
.nav__menu__header__logo {
  color: white;
  font-weight: 400;
  font-size: 40px;
  letter-spacing: 1px;
  text-transform: capitalize;
  margin: 0;
  line-height: 45px;
  height: 45px;
}

.nav__button {
  font-size: 25px;
}

.nav__menu {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  padding: 1rem;
  background-color: color(primary);
  z-index: 4;
}

.nav__menu__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.nav__menu__button {
  font-family: "Teko", sans-serif;
  color: color(headers);
  font-size: 28px;
}

.welcome {
  min-height: 80vh;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://images.unsplash.com/photo-1580086229554-1c2a34000456?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1294&q=80");
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.welcome__header {
  font-weight: 400;
  font-size: 60px;
  text-transform: uppercase;
  color: white;
  padding-top: 1rem;
  padding-bottom: 1rem;
  margin: 0;
}

.welcome__buttons {
  display: flex;
  background-color: color(headers);
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.welcome__button {
  color: color(primary);
  cursor: pointer;
  margin: 0;
  font-size: 22px;
  font-weight: 400;
  font-family: "Teko", sans-serif;
  span {
    font-size: 18px;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    &::before {
      margin: 0;
    }
  }
}

.philosophy {
  color: black;
  padding-bottom: 1rem;
}

.philosophy__header {
  color: black;
  font-weight: 400;
  letter-spacing: 1px;
}

.people {
  padding-top: 1rem;
  padding-bottom: 8rem;
}

.people__header {
  margin-top: 1rem;
}

.coaches {
  background-color: color(headers);
  padding-top: 1rem;
}

.coaches__image {
  margin-top: -6rem;
}

.coaches__header {
  margin-top: 1rem;
}

.app {
  padding-bottom: 2rem;
}

.app__step {
  margin-top: 2rem;
  padding: 0 1rem;
}

.app__step__caption {
  color: color(headers);
  margin-bottom: 2px;
  font-size: 18px;
}

.app__button {
  box-shadow: none;
}

.footer__form {
  background-color: color(secondary);
  display: flex;
  flex-direction: column;
}

.footer__form__header,
.footer__form__text {
  color: white;
}

.footer__contact {
  background-color: color(headers);
  padding-top: 2rem;
  padding-bottom: 1rem;
}

.footer__contact__buttons {
  padding-bottom: 0.5rem;
}

.footer__contact__button {
  color: color(primary);
  font-size: 28px;
  margin: 1.5rem 1rem 1.5rem 0;
  display: flex;
  align-items: center;
}

.footer__contact__button__text {
  font-size: 15px;
  margin: 0;
}

.footer__signature {
  border-top: 1px solid rgba(0, 0, 0, 0.384);
  padding-top: 1rem;
}

.footer__signature__text {
  font-size: 12px;
  margin: 0;
}
</style>
