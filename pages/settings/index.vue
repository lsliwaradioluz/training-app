<template>
  <div class="settings column">
    <BaseHeader>Ustawienia</BaseHeader>
    <div class="column a-start mb1">
      <Avatar
        class="mb1"
        :class="{ 'avatar--loading': loadingImage }"
        :image="user.image ? user.image.url : null"
        :size="80"
      />
      <div class="row">
        <button
          class="button-secondary mr05"
          type="button"
          @click="launchFileUpload"
        >
          Zmień awatar
        </button>
        <button
          class="button-secondary mr05"
          type="button"
          @click="user.image = null"
        >
          Usuń awatar
        </button>
        <nuxt-link
          class="button-secondary"
          type="button"
          tag="button"
          to="change-password"
          append
        >
          Zmień hasło
        </nuxt-link>
      </div>
      <form style="display: none;">
        <input ref="input" name="files" type="file" @change="uploadImage" />
      </form>
    </div>
    <h3 class="mt0">
      Edytuj dane
    </h3>
    <form>
      <BaseInput
        v-model="user.fullname"
        placeholder="Imię i nazwisko"
        type="text"
        :show-status="false"
      />
      <BaseInput
        v-model="user.username"
        placeholder="Nazwa użytkownika"
        type="text"
        :show-status="false"
      />
      <BaseInput
        v-model="user.email"
        placeholder="Adres e-mail"
        type="email"
        :show-status="false"
      />
    </form>
    <div class="user-editor__buttons row j-between mt2">
      <button
        class="button-primary"
        type="button"
        @click="updateUser()"
      >
        Zapisz
      </button>
      <button class="button-primary" type="button" @click="$router.go(-1)">
        Wróć
      </button>
    </div>
  </div>
</template>

<script>
import updateUser from "~/apollo/mutations/updateUser.gql"

export default {
  data() {
    return {
      user: { ...this.$store.getters["auth/user"] },
      client: this.$apollo.getClient(),
      loadingImage: false,
    }
  },
  methods: {
    launchFileUpload() {
      this.$refs.input.click()
    },
    uploadImage() {
      this.loadingImage = true
      const formData = new FormData()
      formData.append("files", this.$refs.input.files[0])
      fetch(`${process.env}/upload-file`, {
        method: "POST",
        body: formData,
      }).then((res) => {
        res.json().then((data) => {
          this.user.image = data[0]
          this.loadingImage = false
        })
      })
    },
    updateUser() {
      const input = {
        id: this.user.id,
        fullname: this.user.fullname,
        username: this.user.username,
        email: this.user.email,
        image: this.user.image ? this.user.image.id : null,
      }

      this.client
        .mutate({ mutation: updateUser, variables: { input } })
        .then((res) => {
          this.$store.commit("auth/setUser", res.data.updateUser)
          this.$router.go(-1)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.avatar--loading {
  &::after {
    content: "⭮";
    color: gray;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.589);
    border-radius: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: spin 1.5s linear infinite;
  }
}

.button-secondary {
  padding: 0.3rem;
  font-size: 12px;
  border-color: white;
  color: white;
}

.user-editor__buttons {
  button {
    width: 49%;
  }
}
</style>
