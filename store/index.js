import cookieparser from 'cookieparser'
import { parseType } from 'graphql';

export const actions = {  
  nuxtServerInit({ commit }, { req }) {
    let user = null;
    let username = null;
    let workoutToPair = null;
    let workoutToCopy = null;
    let workoutAssistantState = null;

    if (req && req.headers && req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie);
      user = (parsed.user && JSON.parse(parsed.user)) || null;
      username = parsed.username == 'null' ? JSON.parse(parsed.username) : parsed.username;
      workoutToPair = (parsed.workoutToPair && JSON.parse(parsed.workoutToPair)) || null;
      workoutToCopy = parsed.workoutToCopy == 'null' ? JSON.parse(parsed.workoutToCopy) : parsed.workoutToCopy;
      workoutAssistantState = (parsed.workoutAssistantState && JSON.parse(parsed.workoutAssistantState)) || null;
    }
    
    commit('auth/setUser', user);
    commit('auth/setUsername', username);
    commit('main/pairWorkout', workoutToPair);
    commit('main/copyWorkout', workoutToCopy);
  }
}