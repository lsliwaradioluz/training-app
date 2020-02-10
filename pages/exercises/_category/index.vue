<template>
  <div>
    <div class="categories main">
      <Head>
        <div class="row j-between">
          <h3 class="m00">{{ category.name }}</h3>
          <i class="flaticon-plus" @click="createSubcategory = true" v-if="createSubcategory == false"></i>
        </div>
      </Head>
      <Category name="Nowa subkategoria" v-if="createSubcategory" @upload="uploadSubcategory($event)" @abort-upload="createSubcategory = false"></Category>
      <Category 
        :class="{ inactive: createSubcategory == true }" 
        v-for="subcategory in category.subcategories" 
        :key="subcategory.id"
        :name="subcategory.name"
        :id="subcategory.id"
        :subfields="subcategory.exercises"
        @delete="deleteSubcategory($event)"
        @edit="editSubcategory($event.id, $event.name)">
      </Category>
    </div>
  </div>
</template>

<script>
  import mainQuery from '~/apollo/queries/exercises/_category/main.gql';
  import createSubcategory from '~/apollo/mutations/createSubcategory.gql';
  import deleteSubcategory from '~/apollo/mutations/deleteSubcategory.gql';
  import updateSubcategory from '~/apollo/mutations/updateSubcategory.gql';

  export default {
    asyncData(context) {
      let client = context.app.apolloProvider.defaultClient;
      const name = context.route.params.category.replace(/_/g, ' ');
      return client.query({ query: mainQuery, variables: { category: name } })
        .then(({ data }) => {
          return {
            category: data.categories[0],
          }
        });
    }, 
    data() {
      return {
        createSubcategory: false,
        client: this.$apollo.getClient(),
      }
    },
    methods: {
      uploadSubcategory(name) {
        const input = {
          data: {
            name: name, 
            category: this.category.id
          }
        }

        this.client.mutate({ mutation: createSubcategory, variables: { input: input } })
          .then(res => {
            window.location.reload(true);
          });
      },
      deleteSubcategory(id) {
        if (confirm('Czy na pewno chcesz usunąć?')) {
          const input = {
            where: {
              id: id
            }
          }

          this.client.mutate({ mutation: deleteSubcategory, variables: { input: input }})
            .then(res => {
              window.location.reload(true);
            });
        }
      }, 
      editSubcategory(id, name) {
        const input = {
          where: {
            id: id
          }, 
          data: {
            name: name, 
          }
        }

        this.client.mutate({ mutation: updateSubcategory, variables: { input: input }})
            .then(res => {
              window.location.reload(true);
            });
      }
    }
  }
</script>