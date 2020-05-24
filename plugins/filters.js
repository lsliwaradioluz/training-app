import Vue from "vue"

Vue.filter("getDayName", (value) => {
  const date = new Date(value)
  const weekDay = date.getDay()
  let dayname

  switch (weekDay) {
    case 1:
      dayname = "Poniedziałek"
      break
    case 2:
      dayname = "Wtorek"
      break
    case 3:
      dayname = "Środa"
      break
    case 4:
      dayname = "Czwartek"
      break
    case 5:
      dayname = "Piątek"
      break
    case 6:
      dayname = "Sobota"
      break
    case 0:
      dayname = "Niedziela"
  }

  return dayname
})

Vue.filter("getShortDayName", (value) => {
  const date = new Date(value)
  const weekDay = date.getDay()
  let dayAbbreviation

  switch (weekDay) {
    case 1:
      dayAbbreviation = "Pn"
      break
    case 2:
      dayAbbreviation = "Wt"
      break
    case 3:
      dayAbbreviation = "Śr"
      break
    case 4:
      dayAbbreviation = "Cz"
      break
    case 5:
      dayAbbreviation = "Pt"
      break
    case 6:
      dayAbbreviation = "Sb"
      break
    case 0:
      dayAbbreviation = "Nd"
  }

  return dayAbbreviation
})

// Filtry daty

Vue.filter("reverseDate", (value) => {
  let dateWithoutTime = value.split("T")
  return dateWithoutTime[0].split("-").reverse().join(".")
})

Vue.filter("getTime", (value) => {
  const date = new Date(value)
  const hours = date.getHours()
  let minutes = date.getMinutes()
  minutes = minutes < 10 ? `${minutes}0` : minutes
  return `${hours}:${minutes}`
})

Vue.filter("getDayAndMonth", (value) => {
  const date = new Date(value)
  let day = date.getDate()
  let month = date.getMonth() + 1
  let dayAndMonth = month < 10 ? `${day}.0${month}` : `${day}.${month}`
  return dayAndMonth
})

Vue.filter("addZero", (value) => {
  return value < 10 ? `0${value}` : value
})

Vue.filter("shorten", (value) => {
  return value.length > 4 ? value.slice(0, 4) : value
})

Vue.filter("shortenText", (value) => {
  return value.length > 25 ? `${value.slice(0, 25)}...` : value
})

Vue.filter("shortenSection", (value) => {
  return value.length > 15 ? `${value.slice(0, 15)}...` : value
})

Vue.filter("shortenExercise", (value) => {
  return value.length > 30 ? `${value.slice(0, 30)}...` : value
})

Vue.filter("shortenAlias", (value) => {
  return value.length > 35 ? `${value.slice(0, 35)}...` : value
})

Vue.filter("showMinutes", (value) => {
  const minutes = Math.floor(value / 60)
  const seconds = value % 60
  let minutesAndSeconds =
    seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`
  return minutesAndSeconds
})

Vue.filter("filterStopwatchTime", (value) => {
  const miliseconds = value % 100 < 10 ? `0${value % 100}` : `${value % 100}`
  let seconds = Math.floor(value / 100)
  if (seconds >= 60) {
    seconds = Math.floor(seconds % 60)
  }
  seconds = seconds < 10 ? `0${seconds}` : `${seconds}`
  const minutes =
    Math.floor(value / 6000) < 10
      ? `0${Math.floor(value / 6000)}`
      : `${Math.floor(value / 6000)}`
  return `${minutes}:${seconds}.${miliseconds}`
})

Vue.filter("getName", (value) => {
  const nameArray = value.split(" ")
  return nameArray[0]
})

Vue.filter("cutFilename", (value) => {
  const nameWithoutType = value.slice(0, -4)
  const type = value.slice(value.length - 3)
  return value.length > 7 ? `${nameWithoutType.slice(0, 7)}...${type}` : value
})
