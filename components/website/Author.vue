<template>
  <article class="author container">
    <section
      class="author__tab"
      data-aos="zoom-in-up"
      data-aos-duration="500"
      data-aos-once="true"
    >
      <img
        class="author__tab__image"
        :src="require(`../../assets/images/lukasz.jpg`)"
        alt="lukasz"
      />
      <h3 class="author__tab__title">Cieszę się, że tu jesteś!</h3>
      <p class="author__tab__caption">
        ''Moim marzeniem było stworzyć prostą i szybką aplikację treningową.
        Dzięki niej moi podopieczni mieli ćwiczyć częściej i chętniej, a ja
        zaoszczędzić czas. Teraz oddaję projekt w Twoje ręce, abyś korzystając z
        niego, pomógł mi go rozwijać'''.
      </p>
      <p class="author__tab__signature">
        Łukasz Śliwa
      </p>
    </section>
  </article>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.author {
  padding-top: 2rem;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.author__tab {
  padding: 2rem;
  background-color: white;
  box-shadow: 1px 1px 4px gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 6px;
  max-width: 300px;
}

.author__tab__image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
}

.author__tab__title {
  color: #ff8000;
  margin-top: 1rem;
}

.author__tab__caption {
  color: #646d74;
  text-align: center;
}

.author__tab__signature {
  text-align: right;
  color: black;
  align-self: flex-end;
  font-weight: 600;
}
</style>
