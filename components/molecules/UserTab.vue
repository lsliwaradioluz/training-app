<template>
  <div class="user-tab">
    <nuxt-link
      class="link"
      tag="div"
      :to="user.id"
      :event="!edit ? '' : 'click'"
      append
    >
      <Avatar class="mr05" :image="user.image ? user.image.url : null" />
      <div>
        <Header>{{ user.username }}</Header>
        <Caption>{{ user.fullname }}</Caption>
      </div>
    </nuxt-link>
    <div v-if="edit" class="row a-center">
      <ContextMenu v-if="!user.admin">
        <template v-slot:trigger>
          <Icon name="vertical-dots" />
        </template>
        <template v-slot:options>
          <button
            v-for="(button, index) in buttons"
            :key="index"
            type="button"
            :class="`flaticon-${button.icon}`"
            @click="button.cb"
          >
            {{ button.caption }}
          </button>
        </template>
      </ContextMenu>
    </div>
  </div>
</template>

<script>
import Header from "../atoms/TabHeader";
import Caption from "../atoms/TabCaption";
import Icon from "../atoms/TabIcon";

import updateUser from "~/apollo/mutations/updateUser.gql";
import deleteUser from "~/apollo/mutations/deleteUser.gql";
import getAllUsers from "~/apollo/queries/getAllUsers.gql";

export default {
  components: { Header, Caption, Icon },
  props: {
    edit: {
      type: Boolean,
    },
    user: {
      type: Object,
    },
  },
  data() {
    return {
      client: this.$apollo.getClient(),
    };
  },
  computed: {
    buttons() {
      const buttons = [
        {
          icon: "pencil",
          caption: this.user.active ? "Archiwizuj" : "Przywróć",
          cb: this.archiveUser,
        },
        {
          icon: "double-arrow-cross-of-shuffle",
          caption: "Transferuj",
          cb: this.$emit.bind(this, "transfer", this.user),
        },
      ];

      if (!this.user.active) {
        buttons.push({
          icon: "trash",
          caption: "Usuń",
          cb: this.deleteUser,
        });
      }

      return buttons;
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
              });
              // find index of deleted item in cached user.workouts array
              const deletedUserIndex = data.users.findIndex(
                (user) => user.id == deleteUser.id
              );
              // remove deleted item from data
              data.users.splice(deletedUserIndex, 1);
              //write data back to cache
              this.client.writeQuery({ query: getAllUsers, data });
            },
          });

          const message = "Podopieczny usunięty pomyślnie";
          this.$store.commit("main/setNotification", message);
        } catch (err) {
          console.log(err);
          const message = "Wystąpił błąd. Sprawdź połączenie z Internetem";
          this.$store.commit("main/setNotification", message);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.user-tab {
  padding: 0.5rem 0;
  display: flex;
}

.link {
  display: flex;
  flex-basis: 100%;
  padding-right: 1rem;
  text-align: left;
}
</style>
