import Cookies from 'js-cookie';
import Vue from 'vue'

export const state = () => ({
  showWorkoutAssistant: false,
  currentWorkout: 0,
  currentSection: [0, 0], 
  showBlockDescription: false,
});

export const mutations = {
  toggleWorkoutAssistant(state) {
    state.showWorkoutAssistant = !state.showWorkoutAssistant;
  }, 
  setCurrentWorkout(state, payload) {
    state.currentWorkout = payload;
  },
  setCurrentSection(state, payload) {
    if (payload) {
      Vue.set(state.currentSection, payload.index, payload.section);
    } else {
      state.currentSection = [0, 0];
    }
  },
  toggleBlockDescription(state) {
    state.showBlockDescription = !state.showBlockDescription;
  }, 
  clearAssistantState(state) {
    state.showWorkoutAssistant = false;
    state.showBlockDescription = false;
    state.currentWorkout = 0;
    state.currentSection = [0, 0];
  }
}

export const getters = {  
  showWorkoutAssistant(state) {
    return state.showWorkoutAssistant;
  },
  currentWorkout(state) {
    return state.currentWorkout;
  },
  currentSection(state) {
    return state.currentSection;
  },
  showBlockDescription(state) {
    return state.showBlockDescription;
  }
}
