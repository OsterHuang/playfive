
lobbyPage = angular.module('lobbyPage', []);

lobbyPage.controller('lobbyController', function ($rootScope, $scope, $http, $window, $localStorage, socket) {
    
    $scope.newGame = {
        rule:'gomoku',
        isTentitiveBlack:true,
        isRatingGame:false,
        hasPerMoveTime:true,
        basicTime:0,
        perMoveTime:30,
        perMovePlusTime:0
    }
    
    $scope.openGreateGameModal = function() {
        $('#createGameDialog').modal({
            keyboard: true
        });
    };
    
    $scope.cancelMyCreatedGame = function() {
        socket.emit('lobby-cancel-game', {uid:$rootScope.user.myCreatedGame.uid, creator:$rootScope.user.myCreatedGame.creator}, null);
    };
    
    $scope.confirmCreteGame = function() {
        
        var game = {
            creator:{nickname:$rootScope.user.nickname, username:$rootScope.user.username},
            rule:$scope.newGame.rule,
            isTentitiveBlack:$scope.newGame.isTentitiveBlack,
            isRating:$scope.newGame.isRatingGame,
            timeRule:{}
        };
        if ($scope.newGame.hasBasicTime) {
            game.timeRule.basicTime = $scope.newGame.basicTime;
        }
        if ($scope.newGame.hasPerMoveTime) {
            game.timeRule.perMoveTime = $scope.newGame.perMoveTime;
        }
        if ($scope.newGame.hasPlusTime) {
            game.timeRule.perMoveTime = $scope.newGame.perMovePlusTime;
        }
        
        socket.emit('lobby-create-game', {newGame:game}, null);
    };
    
    $scope.joinGame = function(game) {
        socket.emit('lobby-join-game', {joinGame:game, participant:$rootScope.user.username}, null);
    }
    
    $scope.cancelCreateGame = function() {
    };
    
    
    // ----
    //
    // ----
    
    socket.on('lobby-user-list', function (data) {
        console.log(data);
        $scope.onlineUsers = data.onlineUsers;
    });
    
    socket.on('lobby-game-list', function (data) {
        console.log(data);
        $scope.createdGames = data.createdGames;
        $scope.progressingGames = data.progressingGames;
        $scope.hasMyCreatedGame();
        $scope.hasMyProgressingGame();
    });
    
    
    
    // ---- U ----
    $scope.hasMyCreatedGame = function() {
        for (var i = 0; i < $scope.createdGames.length; i++) {
            if ($scope.createdGames[i].creator.username == $rootScope.user.username) {
                $rootScope.user.myCreatedGame = $scope.createdGames[i];
                return;
            }
        }
        
        $scope.user.myCreatedGame = null;
    }
    
    $scope.hasMyProgressingGame = function() {
        for (var i = 0; i < $scope.progressingGames.length; i++) {
            if ($scope.progressingGames[i].black.username == $rootScope.user.username ||
               $scope.progressingGames[i].white.username == $rootScope.user.username) {
                $rootScope.user.myProgressingGame = $scope.progressingGames[i];
                return;
            }
        }
    }
    
});
