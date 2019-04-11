# loungevibesHub

Hub project for Epitech 3rd years

## Introduction

Loungevibes is a web plateform where epitech students can play music on the lounge room of Epitech. a Music is added to the lounge playlist
and users can like or dislike this music.

## Functionalities

* Create and use an account (Login/register/logout)
* Add a song to the playlist via name and artist or youtube link
* Like and dislike a song
* See top djs and top songs

## How we made it

Matthias, Charly and I divided the work in 3 part : Back End, Front End and youtube player.

### Back End

The back end is made in NodeJs express. the database used is mongoDB. we use, 3 collections : playlist, passedSong, users.
* **Playlist** : See the schema in Playlist.js . Collection used to stock the current playlist
* **passedSongs** : Same schema as playlist. Collection based on songs that are no longer in the playlist.
* **users** : Users database. see Users.js

To launch the server, 

`npm install && npm start`

### Front End

Front End in AngularJs (different from angular 5 be carreful) to update dynamically the front end.

### Youtube player

That is where the music is played. this url (/youtube/player) must be launched on the raspberrypi chrome page and no students will go on it. This works like an application and when requests are made, we catch the playlist and launch the music.

### Improvements

* Make mongodb work with raspberry pi OR : launch server on a PC at home and the raspberry pi (connected via bluetooth to the hub speakers) will just have to go on /player/playlist to play the music. use ngrok or localtunnel to make your local server available for everyone.

* Top genre
* Better front
