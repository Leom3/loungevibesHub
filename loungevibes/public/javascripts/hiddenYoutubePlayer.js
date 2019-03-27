// Create your app with 'youtube-embed' dependency
var myApp = angular.module('myApp', ['youtube-embed']);
// Inside your controller...
myApp.controller('MyCtrl', function ($scope, $http, $interval, $timeout) {

  $scope.looper = {
    video: 'HpJP4nn5rYM',
    player: null,
    vars: {
      controls: 1,
      autoplay: 1
    }
  };

  $scope.buttonState = false;

  $scope.passNextSong = function() {
    if (videoId.length >= 1) {
      videoId = [];
      response = skipSong();
      response.then(function(data) {
        for (var id in data.data.data)
          videoId.push(data.data.data[id].youtubeId);
        if (videoId.length >= 1) {
          $scope.looper.player.cueVideoById({'videoId': videoId[0],
          'startSeconds': 0,
          'suggestedQuality': 'large'});
          $scope.looper.player.playVideo();
        }
        else {
          $scope.looper.player.cueVideoById({'videoId': 'HpJP4nn5rYM',
          'startSeconds': 0,
          'suggestedQuality': 'large'});
          $scope.looper.player.playVideo();
        }
      })
  }
  };

  $scope.clearPlaylist = function() {
    if (videoId.length >= 1) {
      $scope.buttonState = true;
      response = getSong();
      response.then(function(data) {
        videoId = [];
        for (var id in data.data.data)
          videoId.push(data.data.data[id].youtubeId);
      })
      $timeout(function() {
        videoId.forEach(function(item, index, array) {
          response = skipSong();
        });
        videoId = [];
        console.log("BTN ClearPlaylist = plus rien");
        $scope.looper.player.cueVideoById({'videoId': 'HpJP4nn5rYM',
        'startSeconds': 0,
        'suggestedQuality': 'large'});
        $scope.looper.player.playVideo();
        $scope.buttonState = false;
    }, 5000);
  }
  };

  var videoId = [];

    var intervalId = $interval(function () {
      console.log(videoId);
      if (videoId.length < 1) {
        $http({
          method: 'GET',
          url: '/playlist/getPlaylist'
        }).then(function successCallback(response) {
            for (var id in response.data.data)
              videoId.push(response.data.data[id].youtubeId);
            if (videoId.length >= 1) {
              $scope.looper.player.cueVideoById({'videoId': videoId[0],
                                               'startSeconds': 0,
                                               'suggestedQuality': 'large'});
              $scope.looper.player.playVideo();
            }
          }, function errorCallback(response) {
            console.log("The request failed '/playlist/getPlaylist' : " + response);
          });
      }
      else {
        $http({
          method: 'GET',
          url: '/playlist/getPlaylist'
        }).then(function successCallback(response) {
            console.log("je guette les dislikes hihi")
            if (response.data.data[0].dislikes >= 10) {
              console.log("Aie Personne n'aime ta musique")
              passNextSong();
            }
          }, function errorCallback(response) {
            console.log("The request failed '/playlist/getPlaylist' : " + response);
          });
      }
    }, 5000)

  $scope.$on('$destroy', function () {
    window.clearInterval(intervalId)
  })

  function getSong() {
    var promise = null;
    promise = ($http.get('http://localhost:8080/playlist/getPlaylist'));
    return (promise);
  }

  function skipSong() {
    var promise = null;
    $http({
      method: 'POST',
      url: '/playlist/nextSong'
    });
    promise = ($http.get('http://localhost:8080/playlist/getPlaylist'));
    return (promise);
  }

  $scope.$on('youtube.player.ended', function ($event, player) {
    videoId = [];
    response = skipSong();
    response.then(function(data) {
      for (var id in data.data.data)
        videoId.push(data.data.data[id].youtubeId);
      if (videoId.length >= 1) {
        player.cueVideoById({'videoId': videoId[0],
        'startSeconds': 0,
        'suggestedQuality': 'large'});
        player.playVideo();
      }
      else {
        player.cueVideoById({'videoId': 'HpJP4nn5rYM',
        'startSeconds': 0,
        'suggestedQuality': 'large'});
        player.playVideo();
      }
    })
  });
});