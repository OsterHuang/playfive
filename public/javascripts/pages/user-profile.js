userProfilePage = angular.module('userProfilePage', ['ngStorage']);
userProfilePage.controller('userProfileController', function ($rootScope, $scope, $http, $window, $localStorage) {
    
    $scope.$on('user-profile-refresh', function(event, data) {
        console.log('On find-user event', data);
        $scope.findUser(data);
        $scope.findLatestGames(data.username);
    });
    
    $scope.findUser = function(data) {
        $http(
            {
                url: '/users/user-info',
                method: 'POST',
                data: JSON.stringify({username:data.username, token:$localStorage.token}),
                headers: {'Content-Type': 'application/json'}
            }
              
        ).success(function(response) {
            console.log(response);
            if (response.result != 'success') {
                $rootScope.message = response.message;
                $("#message").alert();
                $("#message").fadeTo(5000, 500).slideUp(500, function() {});
                //$window.location = '/login.html'
            } else {
                $scope.userInfo = response.userInfo;
            }
            
        }).error(function(data, status) {
            console.log('Error ' + status + '. ' + data);
            $rootScope.result = 'Error.';
            $rootScope.message = data.error;
            $("#message").alert();
            $("#message").fadeTo(5000, 500).slideUp(500, function() {});
        });
    };
    
    $scope.findLatestGames = function(username) {
        $http(
            {
                url: '/game/latest-games',
                method: 'POST',
                data: JSON.stringify({username:username, token:$localStorage.token}),
                headers: {'Content-Type': 'application/json'}
            }
              
        ).success(function(response) {
            console.log(response);
            if (response.result != 'success') {
                $rootScope.message = response.message;
                $("#message").alert();
                $("#message").fadeTo(5000, 500).slideUp(500, function() {});
            } else {
                $scope.userLatestGames = response.userLatestGames;
            }
            
        }).error(function(data, status) {
            console.log('Error ' + status + '. ' , data);
            $rootScope.result = 'Error.';
            $rootScope.message = data.error;
            $("#message").alert();
            $("#message").fadeTo(5000, 500).slideUp(500, function() {});
        });
    }
    
    $scope.showStudyBoard = function(game) {
        window.open("analysis-board.html?moves=" + toMovesString(game.moves, game.boardSize), "StudyBoard", "height=600, width=600");
    }
});