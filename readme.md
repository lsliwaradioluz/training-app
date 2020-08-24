# Piti

Piti is a Progressive Web App for personal trainers to manage their clients and create workout schedules. It was created as a response to my own demand for fast and easy-to-use software to aid my current job as personal trainer. It was supposed to replace Google Docs, where everything had to be typed by hand.

## What it means for coaches

Every workout is not a unique and independent work. While working with clients, coaches keep repeating the same schemes and using the same elements. The app's slogan is: "Workouts are like ogres and onions - they have layers". 

- The lowest layer which makes the foundation of every workout is simply an exercise (its name and corresponding video that shows its execution)
- The next layer is a training unit. It is a combination of an exercise and a scheduled number of sets, reps, rest duration and optional remarks regarding the execution
- Next we have a complex. A complex can consist of one or more training units. 
- Complexes are grouped in sections. Section is nothing more that just the highest level structure of a workout. Example sections include Warmup, Skillwork, Strenght, Endurance, Mobility.

In Piti, every client has his own list of workouts. When you create a new workout, you can easily reuse the pieces of the previous ones. It saves a lot of time! Moreover, Piti presumes you don't want to type anything by hand. It was design to take you as few clicks away from creating the workout as possible. 

## What it means for clients

Our clients often receive workout schedules on paper or via email. They find it hard to decipher them, which discourages them from working out. Piti provides them with the next generation Workout Assistant feature. They see the schedule, they click the Assistant button and voila! The assistant treats the workout just like a playlist on Spotify. You can navigate forward to the next exercise (just like next song) or backwards to the previous one. 

The assistant will measure the time you have left till the end of set or rest interval. You can also use it to add comments to the sets you've just performed. That feature ensures great feedback exchange between the client and the coach so that the next workout can be even better than the last!

## Tech stack: 

Frontend:

- HTML
- CSS
- Javascript
- VueJS (Nuxt - because it needed server side rendering)

Backend: [click here](https://github.com/lsliwaradioluz/training-app-API)

## Live Demo 

You can test the app [here](https://www.piti.live). Underneath the "Zaloguj" button there is a line "Jesteś HR-owcem? Wejdź tędy". Click there.

The backend of the app is served on Heroku and it uses free dynos. Therefore it can take several more seconds to load. But do not get discouraged - refresh the page and you should be good to go. 

## Build Setup

```bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## Screenshots

![screenshot](https://github.com/lsliwaradioluz/training-app/blob/master/assets/images/screenshots/user.jpg?raw=true)

![screenshot](https://github.com/lsliwaradioluz/training-app/blob/master/assets/images/screenshots/exercise.jpg?raw=true)

![screenshot](https://github.com/lsliwaradioluz/training-app/blob/master/assets/images/screenshots/exercises.jpg?raw=true)

![screenshot](https://github.com/lsliwaradioluz/training-app/blob/master/assets/images/screenshots/settings.jpg?raw=true)

![screenshot](https://github.com/lsliwaradioluz/training-app/blob/master/assets/images/screenshots/user.jpg?raw=true)

![screenshot](https://github.com/lsliwaradioluz/training-app/blob/master/assets/images/screenshots/workout-assistant.jpg?raw=true)

![screenshot](https://github.com/lsliwaradioluz/training-app/blob/master/assets/images/screenshots/workout-editor.jpg?raw=true)

![screenshot](https://github.com/lsliwaradioluz/training-app/blob/master/assets/images/screenshots/workout-page.jpg?raw=true)
