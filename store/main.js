import Cookies from "js-cookie"

export const state = () => ({
  workoutToPair: null,
  workoutToCopy: null,
  notification: null,
})

export const mutations = {
  pairWorkout(state, workoutToPair) {
    state.workoutToPair = workoutToPair
    Cookies.set("workoutToPair", workoutToPair)
  },
  stopPairWorkout(state) {
    state.workoutToPair = null
    Cookies.set("workoutToPair", null)
  },
  copyWorkout(state, workoutToCopy) {
    state.workoutToCopy = workoutToCopy
    Cookies.set("workoutToCopy", workoutToCopy)
  },
  stopCopyWorkout(state) {
    state.workoutToCopy = null
    Cookies.set("workoutToCopy", null)
  },
  setNotification(state, payload) {
    state.notification = payload
  },
}

export const getters = {
  workoutToPair: (state) => {
    return state.workoutToPair
  },
}
