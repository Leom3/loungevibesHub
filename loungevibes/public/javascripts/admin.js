function capitalize(str) {
	return str.replace(/\w\S*/g, function(txt){
	    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

var app = angular.module("adminApp", []);
app.controller("adminCtrl", function($scope, $http, $timeout) {
	$scope.buttonState = false;
	$scope.cArtist = "";
	$scope.cName = "";

	function removeSongRequest() {
		var promise = null;
    		promise = ($http.post('/playlist/nextSong'));
    		return (promise);
	}

	function getSongRequest() {
		var promise = null;
		promise = ($http.get('/playlist/getPlaylist'));
		return (promise);
	}

	$scope.clearPlaylist = function() {
		res = getSongRequest();
		res.then(function(response) {
			res = response.data
			if (res.data.length >= 1) {
				$scope.buttonState = true;
				response = getSongRequest();
				response.then(function(data) {
					videoId = [];
					for (var id in data.data.data)
						videoId.push(data.data.data[id].youtubeId);
				})
				$timeout(function() {
					videoId.forEach(function(item, index, array) {
						response = removeSongRequest();
						response.then(function(data) {
							$scope.getPlaylist();
						});
					});
				$scope.buttonState = false;
				}, 5000);
			}
		});
	};

	function removeByIdRequest(id) {
		var promise = null;
		$http({
		  method: 'POST',
		  url: '/playlist/removeSongById',
		  data: {"id" : id}
		});
		promise = ($http.get('/playlist/getPlaylist'));
		return (promise);
	      }

	$scope.removeSong = function(id) {
		response = removeByIdRequest(id);
    		response.then(function(data) {
			$scope.getPlaylist();
		    });
	}

	$scope.getPlaylist = function() {
		$http({
			method: 'GET',
			url: '/playlist/getPlaylist'
		}).then(function(response) {
			$scope.playlist = response.data;
			if ($scope.playlist.data.length > 0) {
				for (var i = 0; i < $scope.playlist.data.length; i+= 1) {
					$scope.playlist.data[i].artist = capitalize($scope.playlist.data[i].artist);
					$scope.playlist.data[i].name = capitalize($scope.playlist.data[i].name);
				}
				$scope.cArtist = $scope.playlist.data[0].artist;
				$scope.cName = $scope.playlist.data[0].name;
			}
		});
	};

	$scope.getPlaylist();
	setInterval($scope.getPlaylist, 5000);
});