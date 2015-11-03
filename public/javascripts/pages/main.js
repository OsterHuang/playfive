var server_host = 'localhost';

playfiveApp = angular.module('playfiveApp', ['lobbyPage', 'gamePage', 'announce', 'ngStorage']);

playfiveApp.factory('socket', function ($rootScope) {
  var socket = io.connect('http://' + server_host + ':3030/');
  return {
        on: function (eventName, callback) {
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            }
 
            socket.on(eventName, wrapper);
 
            return function () {
                socket.removeListener(eventName, wrapper);
            };
        },
 
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});
/*
.factory('gameSocket', function ($rootScope) {
  var gameSocket = io(server_host + ':3030/game');
  return {
        on: function (eventName, callback) {
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(gameSocket, args);
                });
            }
 
            gameSocket.on(eventName, wrapper);
 
            return function () {
                socket.removeListener(eventName, wrapper);
            };
        },
 
        emit: function (eventName, data, callback) {
            gameSocket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if(callback) {
                        callback.apply(gameSocket, args);
                    }
                });
            });
        }
    };
});*/


playfiveApp.controller('playfiveController', function ($rootScope, $scope, $http, $window, $localStorage, socket) {
    $rootScope.message = null;
    $rootScope.lobbyChat = '';
    $rootScope.modal = {};
    $rootScope.mainArea = '';
    $scope.chatContent = '';
    
    if (!$localStorage.token) {
        $window.location = '/login.html';
        return;
    }
    
    $rootScope.logout = function() {
        alert('Logout');
        $localStorage.token = null;
        $window.location = '/login.html';
    }
    
    $rootScope.closeMessage = function() {
        $("#message").hide();
    }    
    
    $rootScope.chat = function() {
        socket.emit('message', {from:$rootScope.username, content:$scope.chatContent});
        $scope.chatContent = '';
    }
    
    socket.on('connected', function() {
        $http(
            {
                url: '/users/me',
                method: 'POST',
                data: JSON.stringify({token:$localStorage.token}),
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
                $rootScope.message = 'Welcome ' + response.user.nickname;
                $("#message").alert();
                $("#message").fadeTo(5000, 500).slideUp(500, function() {});
                
                $rootScope.user = response.user;
                socket.emit('online', {username:$rootScope.user.username, nickname:$rootScope.user.nickname}, null);
            }
            
        }).error(function(data, status) {
            console.log('Error ' + status + '. ' + data);
            $scope.result = 'Error.';
            $rootScope.message = data.error;
            $("#message").alert();
            $("#message").fadeTo(5000, 500).slideUp(500, function() {});
        });
        
    });
    
    socket.on('message', function(data) {
        $rootScope.message = data.message;
        $("#message").alert();
        $("#message").fadeTo(5000, 500).slideUp(500, function() {});
//        console.log('On receive message - ' + message); 
//        $rootScope.lobbyChat = $rootScope.lobbyChat + message.from + ':' + message.content + '\n';
//        console.log(' Final lobbyChat:' + $rootScope.lobbyChat);
    });
    
    socket.on('reconnect', function() {
        console.log('Reconnect');
        $rootScope.message = 'Reconnect to server.';
        $("#message").alert();
        $("#message").fadeTo(5000, 500).slideUp(500, function() {});
    });
    
    socket.on('disconnect', function (data) {
        console.log('Disconnect from server' + data);
        $rootScope.message = 'Disconnect from server.';
        $rootScope.user.myProgressingGame = null;
    });
    
});
