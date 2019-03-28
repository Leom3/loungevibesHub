function capitalize(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
var app = angular.module("lvApp", []);
app.controller("lvCtrl", function($scope, $http) {
	$scope.artist = "";
	$scope.track = "";
	$scope.likeNb = 0;
	$scope.dislikeNb = 0;
	$scope.isLiked = false;
	$scope.isDisliked = false;//localStorage.getItem("is_disliked") === null ? false : localStorage.getItem("is_disliked");
	$scope.cArtist = "";
	$scope.cName = "";
	$scope.cAlbum = "";
	$scope.cGenre = "";
	$scope.like = function() {
		if ($scope.isLiked === false ) {		
			$scope.likeNb += 1;
			$scope.isLiked = true;
			localStorage.setItem("is_liked", true);
		} else {			
			$scope.likeNb -= 1;
			$scope.isLiked = false;
			localStorage.setItem("is_liked", false);
		}
	};
	$scope.dislike = function() {
		if ($scope.isDisliked === false ) {		
			$scope.dislikeNb += 1;
			$scope.isDisliked = true;
		} else {
			$scope.dislikeNb -= 1;
			$scope.isDisliked = false;
			//localStorage.setItem("is_disliked", false);
		}
	};
	$scope.getPlaylist = function() {
		$http({
			method: 'GET',
			url: 'http://localhost:8080/playlist/getPlaylist'
		}).then(function(response) {
			$scope.playlist = response.data;
			if ($scope.playlist.data.length === 0) {
				$scope.cArtist = "Aviencloud Radio";
				$scope.cName = "24/7 | Relax & Chill Your Soul, Cozy Vibes •";
				$scope.cAlbum = "";
				$scope.cGenre = "";
				return;
			}
			for (var i = 0;i < $scope.playlist.data.length;i+=1) {
				$scope.playlist.data[i].artist = capitalize($scope.playlist.data[i].artist);
				$scope.playlist.data[i].name = capitalize($scope.playlist.data[i].name);
			}
			$scope.cArtist = $scope.playlist.data[0].artist;
			$scope.cName = $scope.playlist.data[0].name;
			$scope.cAlbum = "Album : " + $scope.playlist.data[0].album;
			$scope.cGenre = "Genre : " + $scope.playlist.data[0].genre;
			console.log($scope.playlist.data);
		});
	};
	$scope.getPlaylist();
	setInterval($scope.getPlaylist, 5000);
	$scope.sendSong = function() {
		$http({
			method: "POST",
			url: "http://localhost:8080/playlist/addSong",
			data: { track: $scope.track, artist: $scope.artist}
		}).then(function successCallback() {
			alert("Song added");
			document.location="/";
		}, function errorCallback() {
			alert("Invalid artist or song");
			$scope.artist = "";
			$scope.track = "";
		});
	};
});

var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("addSong");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
