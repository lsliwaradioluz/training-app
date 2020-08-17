<template>
  <footer class="footer" ref="contact">
    <div class="container">
      <form class="footer__form" @submit.prevent>
        <h3 class="footer__form__header">
          Pochwal, skarć lub zapytaj
        </h3>
        <p class="footer__form__text">
          Aplikacja podoba jak dotychczas każdy obejrzany film? A może jest coś,
          co można zrobić lepiej lub zwyczajnie chcesz się odezwać? Napisz!
        </p>
        <BaseInput
          v-model="formData.email"
          class="footer__form__input"
          placeholder="Twój adres email"
          type="email"
          :show-status="false"
        />
        <BaseTextarea
          v-model="formData.message"
          class="footer__form__input"
          placeholder="Treść wiadomości"
          type="text"
          :rows="5"
          :show-status="false"
        />
        <button class="footer__form__button" type="button" @click="sendMessage">
          Wyślij
        </button>
      </form>
    </div>
    <article class="footer__contact">
      <div class="container">
        <section class="footer__contact__buttons">
          <a
            class="footer__contact__button flaticon-instagram"
            href="https://www.instagram.com/hes.coach.sliwa/"
            target="_blank"
          >
            <p class="footer__contact__button__text">Instagram</p>
          </a>
          <a
            class="footer__contact__button flaticon-linkedin"
            href="https://goo.gl/maps/Lp75gJ4HZg7nBmxr8"
            target="_blank"
          >
            <p class="footer__contact__button__text">LinkedIn</p>
          </a>
          <a
            class="footer__contact__button flaticon-telephone"
            href="tel:+48784184075"
          >
            <p class="footer__contact__button__text">784 184 075</p>
          </a>
        </section>
        <section class="footer__signature">
          <p class="footer__signature__text">
            Coded by Łukasz Śliwa from Piti. Icons made by Freepik from
            www.flaticon.com
          </p>
        </section>
      </div>
    </article>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        email: null,
        message: null,
      },
    };
  },
  methods: {
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
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer__form {
  padding: 2rem;
  background-color: white;
  box-shadow: 1px 1px 4px gray;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  max-width: 300px;
  margin-bottom: 4rem;
}

.footer__form__header {
  color: #ff8000;
}

.footer__form__text {
  color: #646d74;
}

.footer__form__input {
  color: black;
  margin-bottom: .5rem;
}

.footer__form__button,
.footer__motivation__button {
  background-color: #ff8000;
  margin-top: 2rem;
  padding: 8px 20px;
  border-radius: 6px;
  font-family: "Work Sans", sans-serif;
  line-height: 2;
  cursor: pointer;
  transition: opacity 0.3s;
  box-shadow: 2px 2px 2px rgb(107, 107, 107);
  &:active,
  &:hover {
    opacity: 0.8;
  }
}

.footer__contact {
  background-image: linear-gradient(rgb(255, 174, 0) 10%, rgba(255, 174, 0, 0.822) 80%);
  padding-top: 3rem;
  padding-bottom: 1rem;
  position: relative;
  overflow: hidden;
  .container {
    flex-direction: column;
    align-items: stretch;
  }
  
  &:after {
    content: "";
    position: absolute;
    top: -10%;
    left: -10%;
    width: 140%;
    height: 50px;
    transform: rotate(2deg);
    background-color: #fff9eb;
  }
}

.footer__contact__buttons {
  padding-bottom: 0.5rem;
}

.footer__contact__button {
  color: #fff9eb;
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
  border-top: 1px solid #fff9eb;
  padding-top: 1rem;
}

.footer__signature__text {
  font-size: 12px;
  margin: 0;
  color: #fff9eb;
}
</style>
