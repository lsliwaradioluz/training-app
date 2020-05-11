import cookieparser from 'cookieparser';
import exercisesQuery from '~/apollo/queries/exercises/main.gql';

export const actions = {  
  async nuxtServerInit({ commit }, { req, app }) {
    let user = null;
    let workoutToPair = null;
    let workoutToCopy = null;

    if (req && req.headers && req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie);
      user = (parsed.user && JSON.parse(parsed.user)) || null;
      workoutToCopy = (parsed.workoutToCopy && JSON.parse(parsed.workoutToCopy)) || null;
      workoutToPair = (parsed.workoutToPair && JSON.parse(parsed.workoutToPair)) || null;
    }
    
    commit('auth/setUser', user);
    commit('main/pairWorkout', workoutToPair);
    commit('main/copyWorkout', workoutToCopy);
  }
}