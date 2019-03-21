var app = angular.module("lvApp", []);
app.controller("lvCtrl", function($scope) {
	$scope.likeNb = 0;
	$scope.dislikeNb = 0;
	$scope.isLiked = false;
	$scope.isDisliked = false;
	$scope.like = function() {
		if ($scope.isLiked === false ) {		
			$scope.likeNb += 1;
			$scope.isLiked = true;
		} else {			
			$scope.likeNb -= 1;
			$scope.isLiked = false;
		}
	};
	$scope.dislike = function() {
		if ($scope.isDisliked === false ) {		
			$scope.dislikeNb += 1;
			$scope.isDisliked = true;
		} else {			
			$scope.dislikeNb -= 1;
			$scope.isDisliked = false;
		}
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
