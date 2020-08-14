<template>
  <div class="family-editor">
    <BaseInput
      v-model="editedFamily.name"
      placeholder="Nazwa kategorii"
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
      <button v-else class="button-primary" type="button" @click="updateFamily">
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
        return { name: "" };
      },
    },
  },
  data() {
    return {
      client: this.$apollo.getClient(),
      editedFamily: {
        name: this.family.name,
        user: this.$store.state.auth.user.id,
      },
    };
  },
  computed: {
    userID() {
      return this.$store.state.auth.user.id;
    },
  },
  methods: {
    async createFamily() {
      if (!this.verifyInputs()) {
        return;
      }

      try {
        await this.client.mutate({
          mutation: createFamily,
          variables: { input: this.editedFamily },
          update: (cache, { data: { createFamily } }) => {
            // read data from cache for this query
            const data = cache.readQuery({
              query: getAllFamilies,
              variables: { userId: this.userID },
            });
            // push new item to cache
            data.families.unshift(createFamily);
            // write data back to the cache
            this.client.writeQuery({
              query: getAllFamilies,
              variables: { userId: this.userID },
              data,
            });
          },
        });
        this.$router.go(-1);
      } catch (err) {
        const message =
          "Nie udało się utworzyć kategorii. Sprawdź połączenie z Internetem";
        this.$store.commit("main/setNotification", message);
      }
    },
    async updateFamily() {
      if (!this.verifyInputs()) {
        return;
      }

      const input = {
        ...this.editedFamily,
        id: this.family.id,
      };

      try {
        await this.client.mutate({
          mutation: updateFamily,
          variables: { input },
        });
        this.$router.go(-1);
      } catch (err) {
        const message =
          "Nie udało się edytować kategorii. Sprawdź połączenie z Internetem";
        this.$store.commit("main/setNotification", message);
      }
    },
    verifyInputs() {
      if (
        this.editedFamily.name.length < 3
      ) {
        const message = "Tekst w każdym z pól musi mieć co najmniej 3 znaki";
        this.$store.commit("main/setNotification", message);
        return false;
      } else {
        return true;
      }
    },
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
