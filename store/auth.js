import Cookies from 'js-cookie';

export const state = () => ({
  
})

export const mutations = {
  setUser(state, user) {
    state.user = user;
    Cookies.set('user', user);
  },
  async logout(state) {
    this.$router.push({
      path: '/login'
    });
    state.user = null;
    Cookies.set('user', null);
    await this.$apolloHelpers.onLogout();
  }
}

export const getters = {  
  username: state => {
    return state.username
  },
  user: state => {
    return state.user
  }
}
