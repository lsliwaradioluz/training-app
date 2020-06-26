<template>
  <div class="dashboard">
    <BaseHeader>Instrukcje</BaseHeader>
    <article>
      <p>
        Witaj w aplikacji Piti. Mam nadzieję, że mój projekt pomoże Ci ćwiczyć
        bardziej regularnie i z większą radością. Aplikacja wciąż znajduje się w
        fazie testów i dopracowywania, więc mogą pojawiać się błędy. Jeśli
        natrafisz na któryś z nich - daj mi znać. Uwagi na temat potencjalnie
        przydatnych, nowych funkcjonalności równiez są mile widziane!
      </p>
    </article>
    <article class="navigation-tips">
      <h3>Jak zacząć?</h3>
      <p>
        U dołu ekranu znajduje się menu, za pomocą którego możesz nawigować do
        innych części aplikacji.
      </p>
      <section class="navigation-tip">
        <span class="navigation-tip__icon flaticon-home"></span>
        <p>
          Ikona domu przeniesie Cię do obecnej strony, czyli wskazówek na temat
          aplikacji
        </p>
      </section>
      <section class="navigation-tip">
        <span class="navigation-tip__icon flaticon-gymnast"></span>
        <p>
          Kółka gimnastyczne to odnosnik do bazy ćwiczeń Piti, z których
          układane są Twoje treningi. Jeśli chcesz poznać nowe ruchy, możesz
          odwiedzić ją w każdej chwili.
        </p>
      </section>
      <section class="navigation-tip">
        <span class="navigation-tip__icon flaticon-menu"></span>
        <p>
          Ikona listy przekierowuje do Twoich treningów. To tam powinieneś
          wejść, kiedy trener da znać, że rozpisał kolejną z Twoich sesji.
        </p>
      </section>
      <section class="navigation-tip">
        <span class="navigation-tip__icon flaticon-settings"></span>
        <p>
          Koło zębate to nic innego jak odnośnik do ustawień Twojego konta.
          Zmienisz tam swoje dane, hasło dostępu lub avatar.
        </p>
      </section>
      <section class="navigation-tip">
        <span class="navigation-tip__icon flaticon-logout"></span>
        <p>
          Aplikacja Piti korzysta z plików cookie, aby nawet po wyjściu z niej
          lub odświeżeniu strony użytkownik nie musiał logować się ponownie.
          Jeśli jednak z jakiegoś powodu chcesz się wylogować, ostatni przycisk
          służy własnie do tego.
        </p>
      </section>
    </article>
    <article class="assistant-tips">
      <h3>Czym jest cyfrowy asystent treningu?</h3>
      <p>
        Cyfrowy asysstent treningu Piti to największa duma twórcy. Kiedy
        wejdziesz w swoją rozpsikę treningową na dany dzień, możesz włączyć go,
        aby pokazywał kolejne ćwiczenia do wykonania i odmierzał przerwy między
        seriami. Cyfrowy asystent posiada swój własny panel sterowania.
      </p>
      <section class="assistant-tip">
        <span class="assistant-tip__icon flaticon-right-arrow"></span>
        <p>
          Aby poruszać się po asystencie treningu, dotknij ekranu w miejscu
          niezasłoniętym tekstem. Dotknięcie prawej połowy przeniesie Cię do
          kolejnego ćwiczenia, a dotknięcie lewej - cofnie do poprzedniego.
        </p>
      </section>
      <section class="assistant-tip">
        <span class="assistant-tip__icon flaticon-sound"></span>
        <p>
          Ikona głośnika możesz włączyć lub wyłączyć dźwięki asystenta. Chodzi
          tu o krótkie "beepy" wydawane przez timer lub głos twórcy aplikacji,
          mówiący Ci kiedy "działać" lub wrzucić na "luz".
        </p>
      </section>
      <section class="assistant-tip">
        <span class="assistant-tip__icon flaticon-login"></span>
        <p>
          Tym przyciskiem włączysz tak zwany tryb automatyczny, w którym
          asystent sam będzie odliczał czas do końca serii i sam będzie
          przechodził do kolejnego ćwiczenia po jej zakończeniu. Funkcja
          przydaje się w treningach interwałowych typu Tabata, gdzie ćwiczysz w
          cyklu praca - odpoczynek o określonej długości (np. 20 sekund / 10
          sekund). Przy wyłączonym trybie automatycznym wspomniane czynności
          (startowanie zegara i przechodznie do kolejnych serii) musisz
          wykonywać własnoręcznie.
        </p>
      </section>
      <section class="assistant-tip">
        <span class="assistant-tip__icon flaticon-counterclockwise"></span>
        <p>
          Ten przycisk włącza lub wyłącza stoper.
        </p>
      </section>
      <section class="assistant-tip">
        <span class="assistant-tip__icon flaticon-menu"></span>
        <p>
          Ostatnia pozycja służy do otwierania edytora notatek. W trakcie lub po
          każdym treningu zostaw trenerowi komentarz dotyczący każdego z
          wykonanych ćwiczeń. Chodzi tu głównie o liczbę powtórzeń wykonaną w
          ostatnich seriach ćwiczeń siłowych. Dzięki tej informacji trener
          będzie mógł lepiej zaplanować kolejną sesję.
        </p>
      </section>
      <section class="assistant-tip">
        <span
          class="assistant-tip__icon flaticon-movie-player-play-button"
        ></span>
        <p>
          Po prawej stronie panelu znajdziesz przyciski sterujące timerem, który
          odlicza do zera podczas przerw oraz ćwiczeń wykonywanych na czas.
          Możesz go wystartować, zatrzymać, zresetować lub dodać czas do z góry
          założonego.
        </p>
      </section>
    </article>
    <article class="special-buttons__tips">
      <h3>
        Co to za przyciski u góry?
      </h3>
      <p>
        Szare przyciski u góry ekranu to tak zwane przyciski specjalne.
      </p>
      <section class="special-buttons__tip">
        <span class="special-buttons__tip__icon flaticon-left-arrow-2"></span>
        <p>
          Pojedynczą strzałką cofniesz się do poprzedniej odwiedzonej strony
        </p>
      </section>
      <section class="special-buttons__tip">
        <span class="special-buttons__tip__icon flaticon-continuous"></span>
        <p>
          Podwójne, zakręcone strzałki odświeżą aplikację tak, jak odświeża
          się stronę w przeglądarce internetowej. Przydaje się, by
          na nowo pobrać dane aplikacji (na przykład wtedy, gdy trener rozpisze
          dla Ciebie nowy trening, który musi zostać pobrany z serwera)
        </p>
      </section>
    </article>
    <article class="action">
      <h3>Gotowy na pierwszy trening?</h3>
      <p>
        Mam nadzieję, że aplikacja okaże się łatwa i przyjemna w użyciu. A teraz
        przejdź do swoich treningów i zmierz się ze swoją pierwszą rozpiską!
      </p>
      <nuxt-link class="button-primary" to="workouts"
        >Zabierz mnie tam</nuxt-link
      >
    </article>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.navigation-tip,
.assistant-tip,
.special-buttons__tip {
  display: flex;
}

.navigation-tip__icon,
.assistant-tip__icon,
.special-buttons__tip__icon {
  margin-right: 0.5rem;
  font-weight: 600;
  color: color(headers);
}

.action {
  display: flex;
  flex-direction: column;
}
</style>
