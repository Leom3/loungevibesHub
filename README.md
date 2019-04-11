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

The back end is made in NodeJs express. the database used is mongoDB. we use, 3 collecions : playlist, passedSong, users.
* **Playlist** : See the schema in Playlist.js . Collection used to stock the current playlist
* **passedSongs** : Same schema as playlist. Collection based on 
