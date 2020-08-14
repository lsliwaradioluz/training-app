<template>
  <div>
    <LazyWrapper :loading="$apollo.loading">
      <div class="exercises">
        <BaseHeader>
          <span>Ćwiczenia</span>
          <nuxt-link
            v-if="user.admin"
            class="flaticon-plus ml1 t-white"
            :to="{ path: 'new-family' }"
            append
          />
        </BaseHeader>
        <p class="mb0">
          Piti daje Ci pełną elastyczność w tworzeniu własnej bazy ćwiczeń.
          Dodaj nowe kategorie i przypisz im odpowiednie ćwiczenia. Możesz także
          swobodnie przenosić ćwiczenia między kategoriami, usuwać i edytować je zgodnie z własną wizją.
        </p>
        <BaseSearch
          :value="search"
          placeholder="Wyszukaj kategorię"
          @input="searchFunction($event)"
        />
        <template v-if="filteredFamilies.length > 0">
          <transition-group name="animate-list">
            <FamilyTab
              v-for="family in filteredFamilies"
              :key="family.id"
              :family="family"
            />
          </transition-group>
        </template>
        <div class="no-exercises" v-else>
          <span class="flaticon-careless no-exercises__icon"></span>
          <p class="no-exercises__caption">Nie dodałeś jeszcze żadnej kategorii. Możesz to zrobić wciskając plusa w prawym górnym rogu ekranu</p>
        </div>
      </div>
    </LazyWrapper>
  </div>
</template>

<script>
import getAllFamilies from "~/apollo/queries/getAllFamilies.gql";

export default {
  apollo: {
    families: {
      query: getAllFamilies,
      variables() {
        return {
          userId: this.user.id,
        };
      },
    },
  },
  data() {
    return {
      families: [],
    };
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    search() {
      return this.$route.query.search;
    },
    filteredFamilies() {
      if (this.search) {
        return this.families.filter((family) => {
          const search = this.search.toLowerCase();
          const familyName = family.name.toLowerCase();
          const conditions =
            familyName.includes(search) || search.includes(familyName);
          return conditions;
        });
      } else {
        return this.families;
      }
    },
  },
  methods: {
    searchFunction(search) {
      if (search) {
        this.$router.push({ query: { search } });
      } else {
        this.$router.push({ query: {} });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .no-exercises {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem 1rem;
    opacity: 0.2;
  }

  .no-exercises__icon {
    font-size: 80px;
  }

  .no-exercises__caption {
    text-align: center;
  }
</style>
