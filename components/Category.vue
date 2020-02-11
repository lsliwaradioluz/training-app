<template>
  <div class="category tab p11 column">
    <!-- main view  -->
    <div class="row j-between a-stretch" v-if="input == null && id != null">
      <nuxt-link class="category__link pr1" :to="removeWhitespace(name)" tag="div" append>
        <h3 class="m00">{{ name }}</h3>
        <div v-if="subfields.length > 0">
          <span class="category__description" v-for="subfield in subfields" :key="subfield.id">{{ subfield.name }}. </span>
        </div>
        <span class="category__description" v-else>Na razie brak subkategorii</span>
      </nuxt-link>
      <div class="row a-center">
        <i class="flaticon-vertical-dots t-green" @click="showButtonsPanel = !showButtonsPanel"></i>
      </div>
    </div>
    <!-- editor view -->
    <div v-else>
      <h3 class="m00">
        <input class="invisible--input" type="text" v-model="input" ref="categoryNameInput" spellcheck="false">
        <p class="category__description m00">
          Edytuj nazwę
        </p>
      </h3>
    </div>
    <!-- buttons  -->
    <div class="category__panel mt05 pt1 t-green" v-if="showButtonsPanel">
      <div class="row" v-if="input == null && id != null">
        <button @click="$emit('delete', id)">Usuń</button>
        <button @click="editHeader">Edytuj</button>
      </div>
      <div class="row" v-else>
        <button type="button" @click="id ? $emit('edit-category', { id: id, name: input }) : $emit('upload', input)">Zapisz</button>
        <button type="button" @click="id ? input = null : $emit('abort-upload')">Wróć</button>
      </div>
    </div>
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

  .category__link {
    flex-basis: 100%;
  }

  .category__description {
    font-size: 0.7rem;
  }

  .category__panel {
    border-top: 1px solid color(gray);
    font-size: 0.7rem;

    button {
      flex-basis: 50%;
      font-size: inherit;
    }
  }
</style>
