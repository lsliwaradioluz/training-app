<template>
  <div>
    <div class="categories">
      <Head>
        <div class="row j-between">
          <h3 class="m00">Kategorie</h3>
          <i class="flaticon-plus" @click="createCategory = true" v-if="createCategory == false"></i>
        </div>
      </Head>
      <Category name="Nowa kategoria" v-if="createCategory" @upload="uploadCategory($event)" @abort-upload="createCategory = false"></Category>
      <Category
        :class="{ inactive: createCategory == true }" 
        v-for="category in categories" 
        :key="category.id" 
        :name="category.name"
        :id="category.id"
        :subfields="category.subcategories"
        @delete="deleteCategory($event)"
        @edit="editCategory($event.id, $event.name)">
      </Category>
    </div>
  </div>
</template>

<script>
  import mainQuery from '~/apollo/queries/exercises/main.gql';
  import createCategory from '~/apollo/mutations/createCategory.gql';
  import deleteCategory from '~/apollo/mutations/deleteCategory.gql';
  import updateCategory from '~/apollo/mutations/updateCategory.gql';

  export default {
    asyncData(context) {
      const client = context.app.apolloProvider.defaultClient;
      return client.query({ query: mainQuery }) 
        .then(({ data }) => {
          return {
            categories: data.categories
          }
        }) 
    }, 
    data() {
      return {
        createCategory: false, 
        client: this.$apollo.getClient(),
      }
    },
    methods: {
      uploadCategory(name) {
        const input = {
          data: {
            name: name
          }
        }

        this.client.mutate({ mutation: createCategory, variables: { input: input } })
          .then(res => {
            window.location.reload(true);
          });
      },
      deleteCategory(id) {
        if (confirm('Czy na pewno chcesz usunąć?')) {
          const input = {
            where: {
              id: id
            }
          }

          this.client.mutate({ mutation: deleteCategory, variables: { input: input }})
            .then(res => {
              window.location.reload(true);
            });
        }
      }, 
      editCategory(id, name) {
        const input = {
          where: {
            id: id
          }, 
          data: {
            name: name
          }
        }

        this.client.mutate({ mutation: updateCategory, variables: { input: input }})
            .then(res => {
              window.location.reload(true);
            });
      }
    }
  }
</script>