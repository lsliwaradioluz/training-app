<template>
  <div class="website">
    <header class="welcome column j-between">
      <h1 class="welcome__header">Ruch tyłka z kanapy to najlepsze ćwiczenie jakie można wykonać.</h1>
      <div class="welcome__buttons column j-center">
        <nuxt-link class="welcome__button" tag="h3" to="/login">
          Zacznij trening
          <span class="flaticon-right-arrow-2" />
        </nuxt-link>
        <!-- <nuxt-link class="welcome__button" tag="h3" to="/login">
          <span class="flaticon-left-arrow-2" />
          Gdzie ja jestem?
        </nuxt-link> -->
      </div>
    </header>
    <article class="about main">
      <section class="about__section">
        <h2 class="about__header">Trzymasz w ręku moje dziecko</h2>
        <p class="about__caption">Piti to autorski projekt trenera personalnego z tendencją do automatyzowania powtarzalnych czynności. 
          Zmęczony rozpisywaniem treningów na kartce stworzył aplikację, dzięki której układanie planów to bajka.
        </p>
        <span class="flaticon-cancel"></span>
        <p class="about__caption mt1">
          Wcześniej nie omieszkał wypróbować aplikacji już dostępnych na rynku. Żadna nie spełniła jego oczekiwań.
        </p>
      </section>
      <section class="about__section">
        <h2 class="about__header">Prosto i przejrzyście. Albo wcale.</h2>
        <p class="about__caption">
          Każdy trener ma konto, przez które zaprasza do aplikacji swoich podopiecznych.
        </p>
        <p class="about__caption">
          Tworzy własną bazę ćwiczeń, które może ilustrować zdjęciami lub animacjami w formacie GIF. 
        </p>
      </section>
    </article>
  </div>
</template>

<script>
export default {
  layout: "website",
}
</script>

<style lang="scss" scoped>
.welcome {
  min-height: 100vh;
  background-color: color(headers);
}

.welcome__header {
  font-weight: 400;
  font-size: 60px;
  padding: 4rem 1rem;
  color: color(secondary);
  text-transform: uppercase;
  text-decoration: underline;
}

.welcome__buttons {
  background-color: color(secondary);
  padding: 2rem 1rem 3rem 1rem;
}

.welcome__button {
  color: white;
  cursor: pointer;
  margin: 0;
  span {
    font-size: 18px;
    margin-left: .5rem;
    margin-right: .5rem;
    &::before {
      margin: 0;
    }
  }
}

.about {
  text-align: center;
}

.about__section {
  margin-bottom: 8rem;
  &:nth-child(odd) {
    .about__header {
      transform: rotate(1deg);
    }
  } 
  &:nth-child(even) {
    .about__header {
      transform: rotate(-1deg);
    }
  }
}

.about__header {
  font-weight: 700;
  font-size: 36px;
  letter-spacing: 1px;
  text-shadow: 3px 3px black;
  
}

.about__caption {
  font-size: 20px;
}
</style>
