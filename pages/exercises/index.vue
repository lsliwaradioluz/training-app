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
        <p v-if="user.admin" class="mb0">
          Dotknij karty ćwiczenia, aby wyświetlić szczegóły. Dodaj nowe,
          dotykając ikony plusa. Edytuj lub usuń ćwiczenie, rozwijająć menu
          kontekstowe przy jego karcie.
        </p>
        <p v-else class="mb0">
          Baza Piti zawiera aż {{ exercises.length }} ćwiczeń. Wyszukuj je po
          nazwie polskiej lub angielskiej. Możesz także przeglądać wybrane
          kategorie.
        </p>
        <BaseSearch
          :value="search"
          placeholder="Szukaj ćwiczeń"
          @input="searchFunction($event)"
        />
        <template v-if="filteredFamilies.length > 0">
          <transition-group name="animate-list">
            <FamilyTab v-for="family in filteredFamilies" :key="family.id" :family="family" />
          </transition-group>
        </template>
        <p v-else>
          Brak ćwiczeń
        </p>
      </div>
    </LazyWrapper>
  </div>
</template>

<script>
import getAllFamilies from "~/apollo/queries/getAllFamilies.gql"

export default {
  apollo: {
    families: {
      query: getAllFamilies,
    }
  },
  data() {
    return {
      families: [],
    }
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"]
    },
    search() {
      return this.$route.query.search
    },
    filteredFamilies() {
      if (this.search) {
        return this.families.filter((family) => {
          const search = this.search.toLowerCase()
          const alias = family.alias ? family.alias : ""
          const familyName = family.name.toLowerCase() + alias.toLowerCase()
          const conditions =
            familyName.includes(search) || search.includes(familyName)
          return conditions
        })
      } else {
        return this.families
      }
    },
  },
  methods: {
    searchFunction(search) {
      if (search) {
        this.$router.push({ query: { search } })
      } else {
        this.$router.push({ query: {} })
      }
    },
  },
}
</script>
