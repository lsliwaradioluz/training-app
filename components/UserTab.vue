<template>
  <div class="user pt05 pb05 column">
    <div class="row j-between a-stretch">
      <nuxt-link
        class="user__link row"
        tag="div"
        :to="user.id"
        :event="!edit ? '' : 'click'"
        append
      >
        <Avatar class="mr05" :image="user.image ? user.image.url : null" />
        <div>
          <h4 class="m00 t-white">
            {{ user.username }}
          </h4>
          <p class="user__name mb0 t-medium t-faded">
            {{ user.fullname }}
          </p>
        </div>
      </nuxt-link>
      <div v-if="edit" class="row a-center">
        <ContextMenu v-if="!user.admin">
          <template v-slot:trigger>
            <span class="flaticon-vertical-dots t-headers" />
          </template>
          <template v-slot:options>
            <button class="flaticon-pencil" type="button" @click="archiveUser">
              {{ user.active ? "Archiwizuj" : "Przywróć" }}
            </button>
            <button
              class="flaticon-double-arrow-cross-of-shuffle"
              type="button"
              @click="$emit('transfer', user)"
            >
              Transferuj
            </button>
            <button
              v-if="!user.active"
              class="flaticon-trash"
              type="button"
              @click="deleteUser"
            >
              Usuń
            </button>
          </template>
        </ContextMenu>
      </div>
    </div>
  </div>
</template>

<script>
import updateUser from "~/apollo/mutations/updateUser.gql";
import deleteUser from "~/apollo/mutations/deleteUser.gql";
import getAllUsers from "~/apollo/queries/getAllUsers.gql";

export default {
  props: {
    user: {
      type: Object,
    },
    edit: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      client: this.$apollo.getClient(),
    };
  },
  computed: {
    backgroundImage() {
      return this.user.image
        ? this.user.image.url
        : require("assets/images/user.svg");
    },
  },
  methods: {
    archiveUser() {
      const input = {
        id: this.user.id,
        active: this.user.active ? false : true,
      };

      this.client
        .mutate({ mutation: updateUser, variables: { input } })
        .then(() => {
          const message = this.user.active
            ? "Podopieczny został przeniesiony do archiwum."
            : "Podopieczny znów jest aktywny.";
          this.$store.commit("main/setNotification", message);
        })
        .catch((err) => console.log(err));
    },
    async deleteUser() {
      if (
        await this.$root.$confirm(
          "Czy na pewno chcesz usunąć tego użytkownika?"
        )
      ) {

        try {
          await this.client.mutate({
            mutation: deleteUser,
            variables: { id: this.user.id },
            update: (cache, { data: { deleteUser } }) => {
              // read data from cache for chosen queries
              const data = cache.readQuery({
                query: getAllUsers,
                variables: { id: this.$store.state.auth.user.id },
              })
              // find index of deleted item in cached user.workouts array
              const deletedUserIndex = data.users.findIndex(
                (user) => user.id == deleteUser.id
              )
              // remove deleted item from data
              data.users.splice(deletedUserIndex, 1)
              //write data back to cache
              this.client.writeQuery({ query: getAllUsers, data })
            },
          });

          const message = "Podopieczny usunięty pomyślnie"
          this.$store.commit("main/setNotification", message);
        } catch (err) {
          console.log(err)
          const message = "Wystąpił błąd. Sprawdź połączenie z Internetem"
          this.$store.commit("main/setNotification", message);
        }
        
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.user__link {
  flex-basis: 100%;
  h3:first-letter {
    text-transform: lowercase;
  }
}
</style>
