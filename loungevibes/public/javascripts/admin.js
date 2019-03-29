function capitalize(str) {
	return str.replace(/\w\S*/g, function(txt){
	    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

var app = angular.module("adminApp", []);
app.controller("adminCtrl", function($scope, $http) {
	$scope.cArtist = "";
	$scope.cName = "";

	function removeRequest(id) {
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
		response = removeRequest(id);
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