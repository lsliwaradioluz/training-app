import Vue from 'vue';

Vue.filter('englishToPolish', (value) => {
  switch (value) {
    case 'exercises': 
      return 'ćwiczenia';
      break;
    case 'dashboard': 
      return 'pulpit';
      break;
    case 'workouts': 
      return 'treningi';
      break;
    case 'users': 
      return 'Podopieczni';
      break;
    case 'createworkout': 
      return 'Nowy trening';
      break;
    case 'singleExerciseRest': 
      return 'Seria';
      break;
    case 'pairedExerciseRest': 
      return 'Blok';
      break;
    case 'afterBlockRest': 
      return 'Sekcja';
      break;
    case 'warmupRest':
      return 'Rozgrz.';
      break;
  }
});

Vue.filter('getDayName', (value) => {
  const date = new Date(value);
  const weekDay = date.getDay();
  
  switch (weekDay) {
    case 1: 
      return 'Poniedziałek';
      break;
    case 2: 
      return 'Wtorek';
      break;
    case 3: 
      return 'Środa';
      break;
    case 4: 
      return 'Czwartek';
      break;
    case 5: 
      return 'Piątek';
      break;
    case 6: 
      return 'Sobota';
      break;
    case 0: 
      return 'Niedziela';
  }
});

Vue.filter('reverseDate', (value) => {
  let dateWithoutTime = value.split('T');
  return dateWithoutTime[0].split('-').reverse().join('.');
});

Vue.filter('getTime', (value) => {
  const date = new Date(value);
  const hours = date.getHours();
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? `${minutes}0` : minutes;
  return `${hours}:${minutes}`;
});

Vue.filter('addZero', (value) => {
  return value < 10 ? `0${value}` : value;
});

Vue.filter('shorten', (value) => {
  return value.length > 4 ? value.slice(0, 4) : value;
});

Vue.filter('shortenText', (value) => {
  return value.length > 25 ? `${value.slice(0, 25)}...` : value;
});

Vue.filter('shortenSection', (value) => {
  return value.length > 15 ? `${value.slice(0, 15)}...` : value;
});

Vue.filter('showMinutes', (value) => {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  let minutesAndSeconds = seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;
  return minutesAndSeconds;
});

Vue.filter('getName', (value) => {
  const nameArray = value.split(' ');
  return nameArray[0];
});

Vue.filter('cutFilename', (value) => {
  const nameWithoutType = value.slice(0, -4);
  const type = value.slice(value.length - 3);
  return value.length > 7 ? `${nameWithoutType.slice(0, 7)}...${type}` : value;
});