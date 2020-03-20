import cookieparser from 'cookieparser'
import { parseType } from 'graphql';

export const actions = {  
  nuxtServerInit({ commit }, { req }) {
    let user = null;
    let workoutToPair = null;
    let workoutToCopy = null;

    if (req && req.headers && req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie);
      user = (parsed.user && JSON.parse(parsed.user)) || null;
      workoutToPair = (parsed.workoutToPair && JSON.parse(parsed.workoutToPair)) || null;
      workoutToCopy = parsed.workoutToCopy == 'null' ? JSON.parse(parsed.workoutToCopy) : parsed.workoutToCopy;
    }
    
    commit('auth/setUser', user);
    commit('main/pairWorkout', workoutToPair);
    commit('main/copyWorkout', workoutToCopy);
  }
}