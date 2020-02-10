export default function ({ $axios, store, redirect }) {
  
  $axios.onRequest(config => {
    store.commit('main/setLoading');
  })

  $axios.onResponse(response => {
    store.commit('main/unsetLoading');
  });

  $axios.onError(error => {
    store.commit('main/unsetLoading');
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    }
  })
}