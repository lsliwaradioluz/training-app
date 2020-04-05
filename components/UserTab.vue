<template>
<div class="user tab column">
  <div class="row j-between a-stretch">
    <nuxt-link class="user__link row a-center" tag="div" :to="user.id" :event="!edit ? '' : 'click'" append>
      <div class="avatar mr1" :style="{ backgroundImage: `url('${backgroundImage}')`}"></div>
      <div>
        <h3 class="m00">{{ user.username }}</h3>
        <p class="user__name mb0 t-small">{{ user.fullname }}</p>
      </div>
    </nuxt-link>
    <div class="row a-center" v-if="edit">
      <ContextMenu>
        <template v-slot:trigger>
          <i class="flaticon-vertical-dots t-green"></i>
        </template>
        <template v-slot:options>
          <nuxt-link :to="`${user.username}/edit`" tag="button" type="button" append>
            <i class="flaticon-writing"></i>
            Edytuj
          </nuxt-link>
          <button v-on="!user.admin ? { click: deleteUser } : {}" v-if="!user.admin">
            <i class="flaticon-trash"></i>
            Usuń
          </button>
        </template>
      </ContextMenu>
    </div>
  </div>
</div>
</template>

<script>
  import deleteUser from '~/apollo/mutations/deleteUser.gql';

  export default {
    props: {
      user: {
        type: Object,
      }, 
      edit: {
        type: Boolean, 
        defaukt: () => false 
      }
    },
    data() {
      return {
        client: this.$apollo.getClient(),
      }
    },
    computed: {
      backgroundImage() {
        return this.user.image ? this.user.image.url : require('assets/images/user.svg');
      }
    },
    methods: {
      async deleteUser() {
        const input = {
          where: {
            id: this.user.id,
          },
        }
        if (await this.$root.$confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
          this.client.mutate({ mutation: deleteUser, variables: { input: input }  })
            .then(() => {
              window.location.reload();
            })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  .user__link {
    flex-basis: 100%;
    h3:first-letter {
      text-transform: lowercase;
    }
  }
</style>