<template>
  <div class="website">
    <header class="column j-between">
      <h1>Ruch tyłka z kanapy to najlepsze ćwiczenie jakie można wykonać</h1>
      <div class="column j-center">
        <nuxt-link tag="h3" to="/login">
          Zacznij trening
          <span class="flaticon-right-arrow-2"></span>
        </nuxt-link>
      </div>
    </header>
  </div>
</template>

<script>
  export default {
    layout: 'website',
  }
</script>

<style lang="scss" scoped>

  header {
    min-height: 100vh;
    background-color: color(headers);
    h1 {
      font-weight: 400;
      font-size: 60px;
      padding: 4rem 1rem;
      color: color(secondary);
      text-transform: uppercase;
      text-decoration: underline;
    }
    div {
      background-color: color(secondary);
      padding: 2rem 1rem 3rem 1rem;
      h3 {
        color: white;
        cursor: pointer;
        margin: 0;
        span {
          font-size: 18px;
          margin-left: .5rem;
        }
      }
    }
  }

  .about {
    h2 {
      font-weight: 500;
    }

    p {
      font-size: 18px;
    }
  }
  
</style>

