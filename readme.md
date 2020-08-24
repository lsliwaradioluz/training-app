# Piti

Aplikacja typu Progressive Web App dla trenerów personalnych do układania planów treningowych oraz zarządzania klientami. Powstała jako odpowiedź na moje własne zapotrzebowania na szybkie i łatwe w obsłudze oprogramowanie do układania treningów. Miało zastąpić słabo nadające się do tego arkusze Google, gdzie wszystko trzeba było wpisywać ręcznie. 

## Koncepcja dla trenera

Każdy trening nie jest tak naprawdę nowym, niezależnym i całkowicie niepowtarzalnym dziełem. Pracując z klientami, trener bez przerwy korzysta z tych samych elementów, tych samych wzorców. Hasło przewodnie aplikacji Piti to "Treningi są jak ogry i cebula - mają warstwy". 

* Najniżsżą warstwą leżącą u podstawy każdego treningu jest ćwiczenie (jego nazwa oraz przypisany mu film instruktażowy)
* Kolejną warstwą jest jednostka treningowa - połączenie ćwiczenia oraz przypisanej mu liczby serii, powtórzeń, długości odpoczynku oraz ewentualnych uwag co do sposobu wykonania 
* Następną warstwą jest blok. Blok może skłądać się z jednej lub więcej jednostek treningowych. 
* Bloki pogrupowane są w sekcje. Sekcja to nic innego jak najwyższy poziom organizacyjny rozpiski treningowej. Przykładowe sekcje to Rozgrzewka, Skillwork, Siła, Wytrzymałośc, Mobilizacja

Każdy podopieczny ma przypisaną do siebie listę treningów, które już dla niego utworzyłeś. Tworząc kolejne, możesz korzystać z poprzednich, dzięki czemu oszczędzasz czas. Co ważne, aplikacja Piti opiera się na koncepcji "jak najmniej kliknięć". Oznacza to, że została zaprojektowana tak, by ręczne wpisywanie jakiegokolwiek tekstu zdarzało się jak najrzadziej. Ma być szybko! 

## Koncepcja dla podopiecznego

Podopieczni często otrzymują od trenerów rozpiski treningowe na kartce papieru lub w wiadomości email. Nie wiedzą, jak je rozczytać, co zniechęca ich do ćwiczenia. W aplikacji Piti mają do dyspozycji asystenta treningu, który przeprowadzi ich przez sesję krok po kroku. Będzie pokazywał im na ekranie ćwiczenie do wykonania teraz i zaraz, odmierzy czas do końca przerwy lub do końca serii. Pozwoli też dodać notatkę do danego ćwiczenia - czy było łatwe, czy udało się wykonać założoną liczbę powtórzeń i tym podobne. 

## Technologie 

Frontend:

* HTML
* CSS
* Javascript
* VueJS (Nuxt - ze względu na potrzebę Server Side Rendering)

Backend: [link]

## Screenshoty 

- układanie treningu
- dodawanie nowego ćwiczenia 
- asystent treningu 
- dodawanie komentarza do treningu 
- zarządzanie podopiecznymi git push 

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
