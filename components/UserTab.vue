<template>
<div class="user pt05 pb05 column">
  <div class="row j-between a-stretch">
    <nuxt-link class="user__link row" tag="div" :to="user.id" :event="!edit ? '' : 'click'" append>
      <div class="avatar mr05" :style="{ backgroundImage: `url('${backgroundImage}')`}"></div>
      <div>
        <h4 class="m00 t-white">{{ user.username }}</h4>
        <p class="user__name mb0 fs-12 faded">{{ user.fullname }}</p>
      </div>
    </nuxt-link>
    <div class="row a-center" v-if="edit">
      <ContextMenu v-if="!user.admin">
        <template v-slot:trigger>
          <i class="flaticon-vertical-dots t-headers"></i>
        </template>
        <template v-slot:options>
          <button type="button" @click="archiveUser">
            <i class="flaticon-writing"></i>
            {{ user.active ? 'Archiwizuj' : 'Przywróć' }}
          </button>
          <button type="button" @click="$emit('transfer', user)">
            <i class="flaticon-double-arrow-cross-of-shuffle"></i>
            Transferuj
          </button>
        </template>
      </ContextMenu>
    </div>
  </div>
</div>
</template>

<script>
  import updateUser from '~/apollo/mutations/updateUser.gql';
  import mainQuery from '~/apollo/queries/users/main.gql';

  export default {
    props: {
      user: {
        type: Object,
      }, 
      edit: {
        type: Boolean, 
        default: () => false 
      }
    },
    data() {
      return {
        client: this.$apollo.getClient(),
      }
    },
    computed: {
      backgroundImage() {
        return this.user.image ? this.user.image.url : require('assets/images/user.jpg');
      }
    },
    methods: {
      archiveUser() {
        const input = {
          where: {
            id: this.user.id
          }, 
          data: {
            active: this.user.active ? false : true
          }
        }

        this.client.mutate({ mutation: updateUser, variables: { input: input }})
        .then(res => {
          const message = this.user.active ? 
            'Podopieczny został przeniesiony do archiwum.' 
            : 'Podopieczny znów jest aktywny.';
          this.$store.commit('main/setNotification', message);
        });
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

  .user__name {
    opacity: 0.4;
  }
</style>