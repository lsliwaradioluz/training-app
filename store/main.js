import Cookies from 'js-cookie';

export const state = () => ({
  workoutToPair: null,
});

export const mutations = {
  pairWorkout(state, workoutToPair) {
    state.workoutToPair = workoutToPair
    Cookies.set('workoutToPair', workoutToPair);
  }, 
  stopPairWorkout(state) {
    state.workoutToPair = null;
    Cookies.set('workoutToPair', null);
  }
}

export const getters = {  
  workoutToPair: state => {
    return state.workoutToPair
  },
}
