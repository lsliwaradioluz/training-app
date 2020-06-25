<template>
  <div class="family-tab column pt05 pb05">
    <div class="row j-between">
      <nuxt-link class="link pr1 row" :to="this.family.id" append>
        <div>
          <h4 class="m00">
            {{ family.name }}
          </h4>
          <p v-if="family.alias" class="description t-medium t-faded m00">
            {{ family.alias }}
          </p>
          <p v-else class="description t-medium t-faded m00">
            Brak alternatywnej nazwy
          </p>
        </div>
      </nuxt-link>
      <div class="row a-center">
        <!-- <ContextMenu v-if="user.admin">
          <template v-slot:trigger>
            <i class="flaticon-vertical-dots t-headers mr0" />
          </template>
          <template v-slot:options>
            <nuxt-link
              class="flaticon-pencil mr05"
              tag="button"
              type="button"
              :to="`${family.id}/edit`"
              append
            >
              Edytuj
            </nuxt-link>
            <button
              class="flaticon-trash fs-09 mr05"
              type="button"
              @click="deletefamily"
            >
              Usuń
            </button>
          </template>
        </ContextMenu> -->
        <span
          class="flaticon-right-arrow t-headers"
        />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      family: {
        type: Object, 
        required: true, 
      }
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
h4 {
  color: white;
}

.link {
  flex-basis: 100%;
  text-align: left;
}
</style>