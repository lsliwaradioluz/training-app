<template>
  <header class="welcome">
    <div class="welcome__container container">
      <div class="welcome__text">
        <h1 class="welcome__text__header">
          Od trenerów dla trenerów.
        </h1>
        <h4 class="welcome__text__subheader">
          Twórz plany treningowe i zarządzaj podopiecznymi dzięki aplikacji #7
          na rynku fitness. Bez zbędnych funkcji i rozpraszaczy.
        </h4>
        <nuxt-link class="welcome__text__cta" tag="button" to="register-coach">
          <span class="flaticon-right-arrow" /> 
          Wypróbuj za darmo
        </nuxt-link>
      </div>
      <img
        class="welcome__image"
        :src="require(`../../assets/images/${images[0]}.gif`)"
      />
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      images: [
        "add-feedback",
        "add-to-main-screen",
        "choose-workout",
        "sign-up",
        "use-assistant",
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.welcome {
  position: relative;
  background-color: #ffae00;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  width: 100vw;
  padding: 4rem 0;
  &::before {
    content: "";
    position: absolute;
    bottom: -10%;
    left: 0;
    width: 130%;
    height: 100px;
    transform: rotate(-5deg);
    background-color: #fff9eb;
  }
  &::after {
    content: "";
    position: absolute;
    top: 0;
    top: -50%;
    left: 60%;
    height: 120%;
    width: 500px;
    transform: rotate(45deg);
    background: linear-gradient(0, #ffae00 0, #fff9eb 100%);
  }
}

.welcome__container {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 100%;
}

.welcome__text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.welcome__text__header {
  font-weight: 500;
  font-size: 54px;
  text-transform: uppercase;
  color: #fff9eb;
  padding-top: 1rem;
  padding-bottom: 1rem;
  margin: 0;
  z-index: 1;
}

.welcome__text__subheader {
  z-index: 1;
  color: #fff9eb;
  font-size: 22px;
  font-family: "Work Sans", sans-serif;
  letter-spacing: 0.1px;
  max-width: 600px;
}

.welcome__text__cta {
  background-color: #ff8000;
  padding: 8px 20px;
  border-radius: 6px;
  font-family: "Work Sans", sans-serif;
  font-size: 20px;
  line-height: 2;
  margin-top: 2rem;
  cursor: pointer;
  transition: opacity 0.3s;
  &:active,
  &:hover {
    opacity: 0.8;
  }
}

.welcome__image {
  display: none;
}

@media (min-width: 1024px) {
  .welcome__image {
    display: block;
    height: 500px;
    width: 250px;
    background-size: cover;
    background-position: center;
    overflow: hidden;
    border: 4px solid black;
    border-radius: 15px;
    transform: rotate(-5deg);
  }
}

@media (min-width: 1300px) {
  .welcome {
    min-height: 90vh;
  }

  .welcome__text__header {
    font-size: 80px;
  }
}
</style>
