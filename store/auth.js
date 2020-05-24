import Cookies from "js-cookie"

export const state = () => ({
  user: null,
})

export const mutations = {
  setUser(state, user) {
    state.user = user
    Cookies.set("user", user)
  },
  async logout(state) {
    state.user = null
    Cookies.set("user", null)
    await this.$apolloHelpers.onLogout()
  },
}

export const getters = {
  user: (state) => {
    return state.user
  },
}
