<template>
  <div class="family-editor">
    <BaseInput
      v-model="editedFamily.name"
      placeholder="Angielska nazwa"
      :show-status="false"
    />
    <BaseInput
      v-model="editedFamily.alias"
      placeholder="Polska nazwa"
      :show-status="false"
    />
    <BaseTextarea
      v-model="editedFamily.description"
      placeholder="Opis"
      :show-status="false"
    />
    <div class="family-editor__buttons">
      <button
        v-if="!family.name"
        class="button-primary"
        type="button"
        @click="createFamily"
      >
        Zapisz
      </button>
      <button
        v-else
        class="button-primary"
        type="button"
        @click="updateFamily"
      >
        Zapisz
      </button>
      <button class="button-primary" type="button" @click="$router.go(-1)">
        Anuluj
      </button>
    </div>
  </div>
</template>
<script>

import createFamily from "~/apollo/mutations/createFamily.gql";
import updateFamily from "~/apollo/mutations/updateFamily.gql";
import getAllFamilies from "~/apollo/queries/getAllFamilies.gql";

export default {
  props: {
    family: {
      type: Object, 
      default: () => {
        return { name: "", alias: "", description: "" }
      },
    }
  },
  data() {
    return {
      client: this.$apollo.getClient(),
      editedFamily: {
        name: this.family.name, 
        alias: this.family.alias, 
        description: this.family.description,
      },
    };
  },
  methods: {
    async createFamily() {
      if (!this.verifyInputs) {
        return
      }
      
      const input = {
        data: this.editedFamily,
      };

      try {
        await this.client
          .mutate({
            mutation: createFamily,
            variables: { input },
            update: (cache, { data: { createFamily } }) => {
              // read data from cache for this query
              const data = cache.readQuery({ query: getAllFamilies });
              // push new item to cache
              data.families.unshift(createFamily.family);
              // write data back to the cache
              this.client.writeQuery({ query: getAllFamilies, data: data });
            },
          })
        this.$router.go(-1);
      } catch (err) {
        const message = 'Nie udało się utworzyć kategorii. Sprawdź połączenie z Internetem'
        this.$store.commit('main/setNotification', message)
      }
    },
    async updateFamily() {
      if (!this.verifyInputs) {
        return
      }

      const input = {
        where: {
          id: this.family.id,
        },
        data: this.editedFamily,
      };

      try {
        await this.client
          .mutate({
            mutation: updateFamily,
            variables: { input },
          })
        this.$router.go(-1);
      } catch (err) {
        const message = 'Nie udało się edytować kategorii. Sprawdź połączenie z Internetem'
        this.$store.commit('main/setNotification', message)
      }

    }, 
    verifyInputs() {
      if (
        this.editedFamily.name.length < 3 ||
        this.editedFamily.description.length < 3 ||
        this.editedFamily.alias.length < 3
      ) {
        const message = 'Tekst w każdym z pól musi mieć co najmniej 3 znaki'
        this.$store.commit('main/setNotification', message)
        return false
      } else {
        return true
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.family-editor {
  margin-top: 1rem;
}

.family-editor__buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.button-primary {
  width: 49%;
}
</style>
