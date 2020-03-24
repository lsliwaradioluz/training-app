<template>
  <div class="website">
    <section class="hero main">
      <h1 class="mb05 mt2">Online coaching made simple.</h1>
      <p>Z aplikacją Piti prowadzenie treningów personalnych to czysta przyjemność. Stwórz swój profil i podaruj podopiecznym klucz do świetnej formy.</p>
      <button class="button--primary" type="button">Dołącz</button>
    </section>
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
  </div>
</template>

<script>
  export default {
    layout: 'main',
  }
</script>

<style lang="scss" scoped>

  .hero {
    padding-bottom: 40%; 
    background-image: url('~assets/images/vectorpaint.png');
    background-size: cover;
    background-position: right center;
  }
  
  .steps {
    padding-top: 1rem;
  }
</style>

