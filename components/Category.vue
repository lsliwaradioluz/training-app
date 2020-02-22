<template>
  <div class="category tab column" :class="{ pb0: showButtonsPanel }">
    <!-- main view  -->
    <div class="row j-between a-stretch" v-if="input == null && id != null">
      <nuxt-link class="category__link pr1" :to="removeWhitespace(name)" tag="div" append>
        <h3 class="m00">{{ name }}</h3>
        <div v-if="subfields.length > 0">
          <span class="t-small" v-for="subfield in subfields" :key="subfield.id">{{ subfield.name }}. </span>
        </div>
        <span class="t-small" v-else>Na razie brak subkategorii</span>
      </nuxt-link>
      <div class="row a-center">
        <i class="flaticon-vertical-dots t-green" @click="showButtonsPanel = !showButtonsPanel"></i>
      </div>
    </div>
    <!-- editor view -->
    <div v-else>
      <h3 class="m00">
        <input class="input--invisible" type="text" v-model="input" ref="categoryNameInput" spellcheck="false">
        <p class="category__description m00 t-small">
          Edytuj nazwę
        </p>
      </h3>
    </div>
    <!-- buttons  -->
    <transition name="accordion">
      <div class="category__panel mt05 t-green t-small" v-if="showButtonsPanel">
        <div class="row" v-if="input == null && id != null">
          <button @click="$emit('delete', id)">Usuń</button>
          <button @click="editHeader">Edytuj</button>
        </div>
        <div class="row" v-else>
          <button type="button" @click="id ? $emit('edit', { id: id, name: input }) : $emit('upload', input)">Zapisz</button>
          <button type="button" @click="id ? input = null : $emit('abort-upload')">Wróć</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    props: ['id', 'name', 'subfields'],
    data() {
      return {
        showButtonsPanel: this.id == null ? true : false,
        input: this.id == null ? this.name : null
      }
    }, 
    methods: {
      editHeader() {
        this.input = this.name;
        setTimeout(() => {
          this.$refs.categoryNameInput.focus();
        });
      }
    }, 
    mounted() {
      if (this.id == null) this.$refs.categoryNameInput.focus();
    }
  }
</script>

<style lang="scss" scoped>

  .category {
    transition: padding 0.3s;
  }

  .category__link {
    flex-basis: 100%;
  }

  .input--invisible {
    font-size: inherit;
  }

  .category__panel {
    border-top: 1px solid color(gray);

    button {
      padding: 1rem;
      flex-basis: 50%;
      font-size: inherit;
    }
  }
</style>
