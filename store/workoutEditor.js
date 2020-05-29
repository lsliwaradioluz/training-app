export const state = () => ({
  sections: [
    { name: "Rozgrzewka", complexes: [] },
    { name: "Skillwork", complexes: [] },
    { name: "Strength", complexes: [] },
    { name: "Cardio", complexes: [] },
    { name: "Mobility", complexes: [] },
  ],
  sticky: false,
  name: "",
  selectedDate: new Date().toISOString().split("T")[0],
  selectedTime: "18:00:00",
})

export const mutations = {

}

export const actions = {

}

export const getters = {

}