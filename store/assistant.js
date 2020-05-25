import Vue from "vue"

export const state = () => ({
  showWorkoutAssistant: false,
  currentWorkout: 0,
  currentSection: [0, 0],
})

export const mutations = {
  toggleWorkoutAssistant(state) {
    state.showWorkoutAssistant = !state.showWorkoutAssistant
  },
  setCurrentWorkout(state, payload) {
    state.currentWorkout = payload;
  },
  setCurrentSection(state, payload) {
    if (payload) {
      Vue.set(state.currentSection, payload.index, payload.section)
    } else {
      state.currentSection = [0, 0]
    }
  },
  clearAssistantState(state) {
    state.showWorkoutAssistant = false
    state.currentWorkout = 0
    state.currentSection = [0, 0]
  },
}

export const getters = {
  showWorkoutAssistant: (state) => {
    return state.showWorkoutAssistant
  },
  currentWorkout: (state) => {
    return state.currentWorkout
  },
  currentSection: (state) => {
    return state.currentSection
  },
}
