// Create your app with 'youtube-embed' dependency
var myApp = angular.module('myApp', ['youtube-embed']);
// Inside your controller...
myApp.controller('MyCtrl', function ($scope, $http, $interval) {

  $scope.looper = {
    video: 'HpJP4nn5rYM',
    player: null,
    vars: {
      controls: 1,
      autoplay: 1
    }
  };

  var videoId = [];

  if (videoId.length < 1) {
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
            console.log(response);
          });
      }
    }, 5000)
  }

  $scope.$on('$destroy', function () {
    window.clearInterval(intervalId)
  })

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
        console.log("encore des vid here");
        player.cueVideoById({'videoId': videoId[0],
        'startSeconds': 0,
        'suggestedQuality': 'large'});
        player.playVideo();
      }
      else {
        console.log("plus rien");
        player.cueVideoById({'videoId': 'HpJP4nn5rYM',
        'startSeconds': 0,
        'suggestedQuality': 'large'});
        player.playVideo();
      }
    })
  });
});