import Cookies from 'js-cookie';

export const state = () => ({
  
})

export const mutations = {
  setUser(state, user) {
    state.user = user;
    Cookies.set('user', user);
  },
  logout(state) {
    this.$router.push({
      path: '/login'
    });
    state.user = null;
    Cookies.set('user', null);
  }
}

export const getters = {  
  user: state => {
    return state.user && state.user
  }
}
