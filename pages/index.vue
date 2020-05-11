<template>
  <div class="website">
    <header class="column j-between">
      <h1>Get strong in silence. Let your success make all the noise.</h1>
      <div class="row a-center">
        <nuxt-link tag="h3" to="/login">Zacznij trening</nuxt-link>
        <span class="ml1 flaticon-right-arrow-1"></span>
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
      }
    }
  }
  
</style>

