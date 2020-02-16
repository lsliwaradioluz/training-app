import Cookies from 'js-cookie';

export const state = () => ({
  username: null, 
})

export const mutations = {
  setUsername(state, username) {
    state.username = username;
    Cookies.set('username', username);
  },
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
  username: state => {
    return state.username
  },
  user: state => {
    return state.user
  }
}
