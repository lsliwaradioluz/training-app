import cookieparser from 'cookieparser'
import Cookies from 'js-cookie';

export default (context) => {
  const {store} = context;
  let user = null
  let cookies = Cookies.get('user');
  
  if (cookies != null) {
    const parsed = Cookies.getJSON('user');
    user = parsed;
  }

  store.commit('auth/setUser', user);

}