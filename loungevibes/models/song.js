var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var bcrypt = require('bcryptjs');

var db = mongoose.connection;
var Schema = mongoose.Schema;
var MongoObjectID = require("mongodb").ObjectID;

var SongSchema = new Schema({
	name: {
		type: String,
		index : true
	},
	artist: {
		type: String
	},
	album : {
		type : String
	},
	genre: {
		type: String
	},
	youtubeId : {
		type : String
	},
	dj: {
		type: String
	}
}, { usePushEach: true });

var Song = module.exports = mongoose.model('Song', SongSchema);

module.exports.addSongToPlaylist = function(newSong, callback){
	db.collection("playlist").insertOne(newSong, null, function (error, results) {
		if (error) throw error;
		console.log("Song added");
	});
	newSong.save(callback)
}

module.exports.removeSongById = function(songId, callback){
	var songObj = {_id : new MongoObjectID(songId)};
	db.collection("playlist").deleteOne(songObj, null, function (error, result) {
		if (error) throw error;
		console.log("Song removed");
	});
	callback(null);
}

module.exports.removeSongByName = function(name, callback){
	var query = {name : name};
	Song.findOne(query, function(err, song) {
		if (song) {
			console.log(song)
			songObj = {_id : new MongoObjectID(song._id)};
			db.collection("playlist").deleteOne(songObj, null, function (error, result) {
				if (error) throw error;
				console.log("Song removed");
			})
			callback(null);
		}
	});
}