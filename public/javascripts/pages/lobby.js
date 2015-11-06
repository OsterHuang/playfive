
lobbyPage = angular.module('lobbyPage', []);

lobbyPage.controller('lobbyController', function ($rootScope, $scope, $http, $window, $localStorage, socket) {
    
    $scope.lobbyChat = '';
    $scope.lobbyChatOut = {content:''};
    
    $scope.newGame = {
        rule:'gomoku',
        isTentitiveBlack:true,
        isRating:false,
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
            isRating:$scope.newGame.isRating,
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
        socket.emit('lobby-start-game', {joinGame:game, participant:$rootScope.user.username}, null);
    }
    
    $scope.watchGame = function(game) {
        socket.emit('lobby-watch-game', {watchGame:game, participant:$rootScope.user.username}, null);
    }
    
    $scope.chatInLobby = function() {
        socket.emit('lobby-chat-send', {from:$rootScope.user.username, content:$scope.lobbyChatOut.content});
    }
    
    
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
    
    socket.on('lobby-watched-game', function (data) {
        console.log(data);
        socket.emit('lobby-join-game', {joinGame:data});
    });  
    
    socket.on('lobby-chat-receive', function(message) {
        console.log('On lobby-chat-receive', message);
        $scope.lobbyChat = $scope.lobbyChat + message.from + ':' + message.content + '\n';
        $scope.lobbyChatOut.content = '';
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
            if ($scope.progressingGames[i].black.username === $rootScope.user.username ||
                $scope.progressingGames[i].white.username === $rootScope.user.username) {
                if (!$rootScope.user.myProgressingGame) {
                    console.log('emit join game', $rootScope.user);
                    socket.emit('lobby-join-game', {joinGame:$scope.progressingGames[i]});
                    return;
                }
            }
        }
        console.log('No my game here.', $rootScope.user);
    }
    
});
