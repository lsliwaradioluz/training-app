# Piti

Aplikacja dla trenerów personalnych do układania planów treningowych oraz zarządzania klientami. Powstała jako odpowiedź na moje własne zapotrzebowania na szybkie i łatwe w obsłudze oprogramowanie do układania treningów. Miało zastąpić słabo nadające się do tego arkusze Google, gdzie wszystko trzeba było wpisywać ręcznie. 

## Koncepcja 

Każdy trening nie jest tak naprawdę nowym, niezależnym i całkowicie niepowtarzalnym dziełem. Pracując z klientami, trener bez przerwy korzysta z tych samych elementów, tych samych wzorców. Hasło przewodnie aplikacji Piti to "Treningi są jak ogry i cebula - mają warstwy". 

* Najniżsżą warstwą leżącą u podstawy każdego treningu jest ćwiczenie (jego nazwa oraz przypisany mu film instruktażowy)
* Kolejną warstwą jest jednostka treningowa - połączenie ćwiczenia oraz przypisanej mu liczby serii, powtórzeń, długości odpoczynku oraz ewentualnych uwag co do sposobu wykonania 
* Następną warstwą jest blok. Blok może skłądać się z jednej lub więcej jednostek treningowych. 
* Bloki pogrupowane są w sekcje. Sekcja to nic innego jak najwyższy poziom organizacyjny rozpiski treningowej. Przykładowe sekcje to Rozgrzewka, Skillwork, Siła, Wytrzymałośc, Mobilizacja


## Build Setup

``` bash
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
