<template>
  <article class="technologies container">
    <Scrollable class="technologies__carousel">
      <section
        class="technology"
        v-for="(technology, index) in technologies"
        :key="index"
      >
        <img
          class="technology__image"
          :src="require(`../../assets/images/${technology.image}`)"
          :alt="technology.name"
        />
      </section>
    </Scrollable>
  </article>
</template>

<script>
import Scrollable from './Scrollable'

export default {
  components: { Scrollable },
  data() {
    return {
      technologies: [
        { name: "Html", image: "html.png" },
        { name: "Css", image: "css.png" },
        { name: "Javascript", image: "javascript.png" },
        { name: "Vue", image: "vue.png" },
        { name: "Node", image: "node.png" },
        { name: "MongoDB", image: "mongodb.png" },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.technologies {
  padding-top: 2rem;
  padding-bottom: 4rem;
}

.technology {
  flex: 0 0 auto;
  max-width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.technology__image {
  width: 100%;
  opacity: 0.6;
}

</style>
