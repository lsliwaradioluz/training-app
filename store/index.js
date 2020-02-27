import cookieparser from 'cookieparser'
import { parseType } from 'graphql';

export const actions = {  
  nuxtServerInit({ commit }, { req }) {
    let user = null;
    let username = null;
    let workout = null;

    if (req && req.headers && req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie);
      user = (parsed.user && JSON.parse(parsed.user)) || null;
      username = parsed.username == 'null' ? JSON.parse(parsed.username) : parsed.username;
      workout = (parsed.workoutToPair && JSON.parse(parsed.workoutToPair)) || null;
    }
    
    commit('auth/setUser', user);
    commit('auth/setUsername', username);
    commit('main/pairWorkout', workout);
  }
}