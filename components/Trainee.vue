<template>
<div class="trainee row tab">
  <nuxt-link class="trainee__tab row a-center" tag="div" :to="user.username" append>
    <div class="avatar mr1" :style="{ backgroundImage: `url('${backgroundImage}')`}"></div>
    <div>
      <h3 class="m00">{{ user.username }}</h3>
      <p class="trainee__email mb0">{{ user.fullname }}</p>
    </div>
  </nuxt-link>
  <div class="trainee__actions column j-between t-green" v-if="edit">
    <i class="flaticon-close small" @click="deleteUser"></i>
    <nuxt-link class="flaticon-adjust small" :to="`${user.username}/edit`" tag="i" append></nuxt-link>
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
    computed: {
      backgroundImage() {
        return this.user.image ? this.user.image.url : 'https://res.cloudinary.com/drsgb4wld/image/upload/v1579693365/u8xvypx32t6zphrfrbvl.svg';
      }
    },
    methods: {
      deleteUser() {
        const input = {
          where: {
            id: this.user.id,
          },
        }
        const client = this.$apollo.getClient();
        if (confirm("Czy na pewno chcesz usunąć ten element?")) {
          client.mutate({ mutation: deleteUser, variables: { input: input }  })
            .then(res => {
              window.location.reload(true);
            })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .trainee__tab {
    flex-basis: 95%;
    margin-right: 2px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    h3:first-letter {
      text-transform: lowercase;
    }
  }

  .trainee__actions {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .trainee__email {
    font-size: 0.7rem;
  }
</style>