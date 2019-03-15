var express = require('express');
var router = express.Router();
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var Song = require('../models/song');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var db = mongoose.connection;
var Schema = mongoose.Schema;

var success_json = {
	code : 200,
	msg : "Success"
}

var error_json = {
	code : 400,
	msg : "Failure"
}

router.post('/addSong', function(req, res) {
	json_response = {
		code : 200,
		msg : "request_success"
	};
	var name = req.body.name;
	var artist = req.body.artist;
	var genre = req.body.genre;
	var dj = req.body.DJ;
	var newSong = new Song({
		song_id : Date.now,
		name : name,
		artist : artist,
		genre : genre,
		dj : dj
	})
	console.log(newSong)
	Song.addSongToPlaylist(newSong, function(err, song) {
		if (err) {
			throw err;
			res.json(error_json)
		}
	});
	res.json(success_json);
});


router.post('/removeSongById', function (req, res) {
	var id = req.body.id;
	Song.removeSongById(id, function(err) {
		if (err) {
			throw err;
			res.json(error_json);
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

module.exports = router;