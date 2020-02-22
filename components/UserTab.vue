<template>
<div class="user tab column" :class="{ pb0: showButtonsPanel }">
  <!-- main view  -->
  <div class="row j-between a-stretch">
    <nuxt-link class="user__link row a-center" tag="div" :to="user.username" append>
      <div class="avatar mr1" :style="{ backgroundImage: `url('${backgroundImage}')`}"></div>
      <div>
        <h3 class="m00">{{ user.username }}</h3>
        <p class="user__name mb0 t-small">{{ user.fullname }}</p>
      </div>
    </nuxt-link>
    <div class="row a-center" v-if="edit">
      <i class="flaticon-vertical-dots t-green" @click="showButtonsPanel = !showButtonsPanel"></i>
    </div>
  </div>
  <!-- buttons -->
  <transition name="accordion">
    <div class="user__panel row mt05 t-green t-small" v-if="showButtonsPanel">
      <button @click="deleteUser">Usuń</button>
      <nuxt-link :to="`${user.username}/edit`" tag="button" type="button" append>Edytuj</nuxt-link>
    </div>
  </transition>
</div>
</template>

<script>
  import deleteUser from '~/apollo/mutations/deleteUser.gql';
  import deleteSkill from '~/apollo/mutations/deleteSkill.gql';

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
        showButtonsPanel: false,
        client: this.$apollo.getClient(),
      }
    },
    computed: {
      backgroundImage() {
        return this.user.image ? this.user.image.url : require('assets/images/user.svg');
      }
    },
    methods: {
      deleteUser() {
        const input = {
          where: {
            id: this.user.id,
          },
        }

        if (confirm("Czy na pewno chcesz usunąć ten element?")) {
          this.client.mutate({ mutation: deleteUser, variables: { input: input }  })
            .then(res => {
              this.deleteSkill(res.data.deleteUser.user.skill.id);
            })
        }
      }, 
      deleteSkill(id) {
        const input = {
          where: {
            id: id
          },
        }
        this.client.mutate({ mutation: deleteSkill, variables: { input: input }  })
          .then(res => {
            window.location.reload(true);
          })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .user {
    transition: padding 0.3s;
  }

  .user__link {
    flex-basis: 100%;

    h3:first-letter {
      text-transform: lowercase;
    }
  }

  .user__panel {
    border-top: 1px solid color(gray);

    button {
      padding: 1rem;
      flex-basis: 50%;
      font-size: inherit;
    }
  }
</style>