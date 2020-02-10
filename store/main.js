export const state = () => ({
  loading: false
});

export const mutations = {
  setLoading(state) {
    state.loading = true;
  }, 
  unsetLoading(state) {
    state.loading = false;
  }
}

export const getters = { 
  loading: state => {
    return state.loading
  }
}