var express = require('express');
var router = express.Router();
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var Song = require('../models/song');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var request = require('request');

var db = mongoose.connection;
var Schema = mongoose.Schema;

var youtubeKey = "AIzaSyAxcy29ndnjP0BykxHe02IhnZ3FaUB6T6w";

var {google} = require('googleapis');
var youtube = google.youtube({
	version: 'v3',
	auth: youtubeKey
});

var success_json = {
	code : 200,
	msg : "Success"
}

var error_json = {
	code : 400,
	msg : "Failure"
}

router.get('/player', function(req, res) {
	res.render('player');
});

function addYoutubeUrl(newSong) {
	query = newSong.artist + " " + newSong.name;
	console.log(query);
	youtube.search.list({
		part: 'snippet',
		q: query,
		maxResults : 5
	}, function (err, data) {
		if (err) {
			console.error('Error: ' + err);
			return false;
		}
		if (data)
			newSong.youtubeId = data.data.items[0].id.videoId;
		Song.addSongToPlaylist(newSong, function(err, song) {
			if (err) {
				throw err;
			}
		});
	});
	return true;
}

router.post('/addSong', function(req, res) {
	var track = req.body.track;
	var artist = req.body.artist;
	var dj = req.user.username;
	var genre = "";
	var album = "";

	request('http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=2b7bdafa672b6693eed5de92150b3f12&artist=' + artist + '&track=' + track + '&format=json'
		, function(error, response, body) {
			if (error) throw error;
			bodyjson = JSON.parse(body);
			if (bodyjson.error || bodyjson.track.duration == 0) {
				res.redirect(400, '/');
				return;
			}
			console.log(bodyjson);
			if (bodyjson.track.album != undefined)
				album = bodyjson.track.album.title;
			if (bodyjson.track.toptags.tag.length > 1)
				genre = bodyjson.track.toptags.tag[0].name;

			var newSong = new Song({
				name : track,
				artist : artist,
				genre : genre,
				album : album,
				dj : dj,
				youtubeId : "",
				likes : "0",
				dislikes : "0"
			});
			addYoutubeUrl(newSong);
			res.redirect(200, '/');
			return;
		});
});

router.post('/removeSongById', function (req, res) {
	var id = req.body.id;
	Song.removeSongById(id, function(err) {
		if (err) {
			throw err;
		}
	});
	res.json(success_json);
});

router.post('/removeSongByName', function (req, res) {
	var name = req.body.name;
	Song.removeSongByName(name, function(err) {
		if (err) {
			throw err;
			res.json(error_json);
		}
	});
	res.json(success_json);
});

router.get('/getPlaylist', function (req, res) {
	db.collection("playlist").find().toArray(function (error, results) {
        if (error) throw error;

        var json_data = results;
        var json_response = {
        	code : 200,
        	data : json_data
        };
        res.json(json_response);
    });
});

function addSongToPassedSong(song) {
	console.log(song);
}

router.post('/nextSong', function (req, res) {
	db.collection("playlist").find().toArray(function (error, results) {
		if (error) throw error;
		if (results.length < 1 || req.user == undefined) {
			return (res.json(error_json));
		}
		//addSongToPassedSong(results[0]);
		songLikes = Number(results[0].likes);
		addedLikes = songLikes + Number(req.user.likes);
		req.user.likes = String(addedLikes);
		db.collection("users").save(req.user);
		Song.removeSongById(results[0]._id, function(err) {
			if (err) {
				throw err;
			}
		});
		res.json(success_json);
	})
})

router.post('/addLike', function(req, res) {
	db.collection("playlist").find().toArray(function (error, results) {
		if (error) throw error;
		if (results.length < 1)
			return (res.json(error_json));
		results[0].likes = String(Number(results[0].likes) + 1);
		db.collection("playlist").save(results[0]);
	})
	res.json(success_json);
})

router.post('/addDislike', function(req, res) {
	db.collection("playlist").find().toArray(function (error, results) {
		if (error) throw error;
		if (results.length < 1)
			return (res.json(error_json));
		results[0].dislikes = String(Number(results[0].dislikes) + 1);
		db.collection("playlist").save(results[0]);
	})
	res.json(success_json);	
})

router.get('/getBestDj', function(req, res) {
	db.collection("users").find().sort({ likes: -1}).toArray(function(error, results) {
		var json_data = results;
        var json_response = {
        	code : 200,
        	data : json_data
        };
        res.json(json_response);
	});
})
module.exports = router;