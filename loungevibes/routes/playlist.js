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
			console.log(data);
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
	if (req.user != undefined)
		var dj = req.user.username;
	else
		var dj = "Unknown";
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
			var check = addYoutubeUrl(newSong);
			if (check == true)
				res.redirect(200, '/');
			else
				res.redirect(400, '/');
			return;
		});
});

router.post('/addUrl', function (req, res) {
	var url = req.body.url;
	if (req.user != undefined)
		var dj = req.user;

	url = String(url);
	id = url.slice(url.indexOf("=") + 1);
	var newSong = new Song({
		name : url,
		artist : "",
		genre : "",
		album : "",
		dj : dj,
		youtubeId : id,
		likes : "0",
		dislikes : "0"
	});
	Song.addSongToPlaylist(newSong, function(err, song) {
		if (err) {
			throw err;
		}
	});
	res.redirect(200, '/');
	return;
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
	db.collection("passedSong").find().toArray(function (error, results) {
		for (i in results) {
			if (results[i].name == song.name && results[i].artist == song.artist) {
				results[i].likes = String(Number(results[i].likes) + Number(song.likes));
				db.collection("passedSong").save(results[i]);
				return;
			}
		}
		db.collection("passedSong").insertOne(song, null, function (error, results) {
			if (error) throw error;
			console.log("Song added to passed song");
			return;
		});
	});
	return;
}

router.post('/nextSong', function (req, res) {
	db.collection("playlist").find().toArray(function (error, results) {
		if (error) throw error;
		if (results.length < 1 || req.user == undefined) {
			return (res.json(error_json));
		}
		addSongToPassedSong(results[0]);
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
		res.json(success_json);
	})
})

router.post('/addDislike', function(req, res) {
	db.collection("playlist").find().toArray(function (error, results) {
		if (error) throw error;
		if (results.length < 1)
			return (res.json(error_json));
		results[0].dislikes = String(Number(results[0].dislikes) + 1);
		db.collection("playlist").save(results[0]);
		res.json(success_json);
	})
})

router.post('/removeLike', function(req, res) {
	db.collection("playlist").find().toArray(function (error, results) {
		if (error) throw error;
		if (results.length < 1)
			return (res.json(error_json));
		results[0].likes = String(Number(results[0].likes) - 1);
		db.collection("playlist").save(results[0]);
		res.json(success_json);
	})
})

router.post('/removeDislike', function(req, res) {
	db.collection("playlist").find().toArray(function (error, results) {
		if (error) throw error;
		if (results.length < 1)
			return (res.json(error_json));
		results[0].dislikes = String(Number(results[0].dislikes) - 1);
		db.collection("playlist").save(results[0]);
		res.json(success_json);
	})
})

router.get('/getBestDj', function(req, res) {
	db.collection("users").find().sort({ likes: -1}).toArray(function(error, results) {
		if (results.length < 1)
			return (res.json(error_json));
		var json_data = results;
        var json_response = {
        	code : 200,
        	data : json_data
        };
        res.json(json_response);
	});
})

router.get('/getBestSongs', function(req, res) {
	db.collection("passedSong").find().sort({likes : -1}).toArray(function(error, results) {
		if (results.length < 1)
			return (res.json(error_json));
		var json_data = results;
		var json_response = {
        	code : 200,
        	data : json_data
        };
        res.json(json_response);
	});
})
module.exports = router;