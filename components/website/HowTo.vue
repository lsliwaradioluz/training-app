<template>
  <article class="howtos">
    <div class="container">
      <section
        class="howto"
        v-for="(howto, index) in howtos"
        :key="index"
        data-aos="zoom-in"
        data-aos-duration="500"
        data-aos-once="true"
      >
        <h3 class="howto__title">{{ howto.title }}</h3>
        <img
          class="howto__icon"
          :src="require(`../../assets/images/${howto.icon}`)"
          :alt="howto.title"
        />
        <p class="howto__caption">{{ howto.caption }}</p>
      </section>
    </div>
    <div class="howtos__add-to-main-screen">
      <div class="container">
        <h4 class="howtos__add-to-main-screen__title">
          Dodaj aplikację Piti do ekranu głównego
        </h4>
        <p class="howtos__add-to-main-screen__caption">
          Piti to Progressive Web App. Mimo, że uruchamiasz ją poprzez
          przeglądarkę, można dodać ją do ekranu głównego. Jej ikona pojawi się
          menu głównym Twojego smartfona i będzie działać jak typowa aplikacja
          natywna, pobrana z Google Play lub App Store!
        </p>
        <button
          class="howtos__add-to-main-screen__button"
          type="button"
          @click="showModal = true"
        >
          Pokaż mi, jak to zrobić
        </button>
        <Modal :show="showModal" @close="showModal = false"> </Modal>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      howtos: [
        {
          title: "Załóż konto",
          icon: "contract.svg",
          caption:
            "Rejestracja w aplikacji Piti zajmuje czterdzieści sekund i jest całkowicie darmowa. Nie zapytamy Cię o żadne wrażliwe dane.",
        },
        {
          title: "Zaproś podopiecznych",
          icon: "email.svg",
          caption:
            "Podaj imię, naziwko oraz adres e-mail podopiecznego, aby zaprosić go do korzystania z aplikacji Piti. Otrzyma link do formularza, gdzie dokończy rejestrację.",
        },
        {
          title: "Uzupełnij bazę ćwiczeń",
          icon: "bench.svg",
          caption:
            "Piti daje Ci pełną elastyczność w tworzeniu własnej bazy ćwiczeń. Dodaj nowe kategorie i przypisz im odpowiednie ćwiczenia. Możesz także swobodnie przenosić ćwiczenia między kategoriami, usuwać i edytować je zgodnie z własną wizją.",
        },
        {
          title: "Rozpisz pierwszy trening",
          icon: "trick.svg",
          caption:
            "Wybierz podopiecznego i ułóż dla niego trening, korzystająz z bazy ćwiczeń. Nie będziesz musiał nic wpisywać ręcznie - wystarczy klikać!",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.howtos {
  padding-top: 2rem;
  position: relative;
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.howto {
  text-align: center;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 300px;
}

.howto__title {
  color: #ff8000;
}

.howto__icon {
  height: 80px;
  width: 80px;
  border-radius: 50%;
  box-shadow: 3px 3px 2px #646d74;
}

.howto__caption {
  color: #646d74;
  margin-top: 1rem;
}

.howtos__add-to-main-screen {
  background-color: white;
  padding: 2rem 0 15% 0;
  text-align: center;
  position: relative;
  margin-bottom: 15%;
  overflow: hidden;
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &:after {
    content: "";
    position: absolute;
    height: 20%;
    width: 150%;
    background-color: #fff9eb;
    bottom: -15%;
    left: -10%;
    transform: rotate(3deg);
  }
}

.howtos__add-to-main-screen__title {
  color: #ff8000;
}

.howtos__add-to-main-screen__caption {
  color: #646d74;
}

.howtos__add-to-main-screen__button {
  background-color: #ff8000;
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

@media (min-width: 1024px) {
  .howtos .container {
    flex-direction: row;
    align-items: flex-start;
  }

  .howto {
    padding-right: 2rem;
    padding-left: 2rem;
    flex-basis: 25%;
    flex-grow: 0;
  }

  .howtos__add-to-main-screen {
    padding: 7% 0 10% 0;
    margin-bottom: 0; 
  }

  .howtos__add-to-main-screen .container {
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 60%;
  }
}

</style>
