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
      <ContextMenu v-if="!user.admin">
        <template v-slot:trigger>
          <i class="flaticon-vertical-dots t-green"></i>
        </template>
        <template v-slot:options>
          <button type="button">
            <i class="flaticon-writing"></i>
            Archiwizuj
          </button>
          <button type="button" @click="transferModalVisible = true">
            <i class="flaticon-double-arrow-cross-of-shuffle"></i>
            Transferuj
          </button>
        </template>
      </ContextMenu>
      <Modal :show="transferModalVisible" @close="transferModalVisible = false">
        <div class="tab">
          <h3 class="t-green mt0">Transferuj podopiecznego</h3>
          <p>Podaj adres e-mail trenera, któremu chcesz przekazać podopiecznego. Musi to być adres, którego użył przy zakładaniu konta.</p>
          <CustomInput
            v-model="transferEmail"
            placeholder="Adres email" 
            icon="email"
            type="email"
            :show-status="false"></CustomInput>
          <div class="user__buttons p00 pt2 row j-between t-green">
            <button type="button" @click="transferUser">Transferuj</button>
            <button type="button" @click="transferModalVisible = false">Wróć</button>
          </div>
        </div>
      </Modal>
    </div>
  </div>
</div>
</template>

<script>
  import deleteUser from '~/apollo/mutations/deleteUser.gql';
  import updateUser from '~/apollo/mutations/updateUser.gql';
  import getUserByEmail from '~/apollo/queries/users/getUserByEmail.gql';

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
        transferModalVisible: false,
        transferEmail: null,
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
      }, 
      transferUser() {
        this.client.query({ query: getUserByEmail, variables: { email: this.transferEmail } })
        .then(res => {
          if (!res.data.users[0].admin) {
            this.$store.commit('main/setNotification', 'Użytkownik o podanym adresie e-mail nie jest trenerem.');
            return
          }

          const input = {
            where: {
              id: this.user.id,
            }, 
            data: {
              user: res.data.users[0].id,
            }
          }

          this.client.mutation({ mutation: updateUser, variables: { input: input } })
          .then(res => {
            this.transferModalVisible = false;
            this.$store.commit('main/setNotification', 'Transfer podopiecznego zakończony sukcesem!');
          })
          .catch(err => {
            this.$store.commit('main/setNotification', 'Transfer podopiecznego nie udał się.');
          });
        })
        .catch(err => {
          this.$store.commit('main/setNotification', 'Nie ma takiego adresu e-mail w bazie.');
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

  .user__buttons {
    button {
      width: 50%;
      &:nth-child(1) {
        border-right: 1px solid rgba(230, 230, 230, 0.08);
      }
      &:nth-child(2) {
        border-left: 1px solid rgba(230, 230, 230, 0.08);
      }
    }
  }
</style>