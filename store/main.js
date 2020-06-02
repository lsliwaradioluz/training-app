import Cookies from "js-cookie"

export const state = () => ({
  notification: null,
  db: null,
  workoutToPair: null,
  workoutToCopy: null,
  workoutEditor: {
    isEditing: null, 
    backup: null,
  }, 
})

export const mutations = {
  setNotification(state, payload) {
    state.notification = payload
  },
  saveDb(state, payload) {
    state.db = payload
  },
  saveWorkouts(state, workoutsObj) {
    state.workoutToCopy = workoutsObj.workoutToCopy
    state.workoutToPair = workoutsObj.workoutToPair
    state.workoutEditor.backup = workoutsObj.workoutEditorBackup
  },
  setIsEditing(state, payload) {
    state.workoutEditor.isEditing = payload
  }, 
  clearWorkoutEditorBackup(state) {
    state.workoutEditor.backup = null;
  },
}

export const actions = {
  setupDb({ state, commit, dispatch }) {
    var request = window.indexedDB.open("pitidb")
    request.onerror = (event) => {
      console.log('error occured while opening database.')
    }
    request.onsuccess = (event) => {
      commit('saveDb', event.target.result)
      dispatch('getEntryFromDb')
      state.db.onerror = (event) => {
        const errorMessage = event.srcElement.error
        console.log(errorMessage)
      }
    }
    request.onupgradeneeded = (event) => {
      let objectStore = state.db.createObjectStore("workouts", { keyPath:'type' })
    }
  }, 
  getEntryFromDb({ state, commit }) {
    const workouts = {}
    state.db.transaction("workouts").objectStore("workouts").openCursor().onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        workouts[cursor.key] = cursor.value
        cursor.continue()
      } else {
        commit('saveWorkouts', workouts);
      }
    };
  },
  addEntryToDb({ state, dispatch }, payload) {
    const transaction = state.db.transaction(["workouts"], "readwrite")
    const objectStore = transaction.objectStore("workouts")
    const request = objectStore.add(payload)
    request.onsuccess = (event) => {
      dispatch('getEntryFromDb');
    };
  }, 
  removeEntryFromDb({ state, dispatch }, workout) {
    const request = state.db
      .transaction(['workouts'], 'readwrite')
      .objectStore("workouts")
      .delete(workout);
    request.onsuccess = () => {
      dispatch('getEntryFromDb');
    }
  }, 
  updateEntryInDb({ state, dispatch }, payload) {
    const objectStore = state.db.transaction(["workouts"], "readwrite").objectStore("workouts");
    const requestUpdate = objectStore.put(payload);
    requestUpdate.onsuccess = (event) => {
      dispatch('getEntryFromDb');
    };
  }
}

export const getters = {
  
}
