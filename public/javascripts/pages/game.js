
gamePage = angular.module('gamePage', []);

gamePage.controller('gameController', function ($rootScope, $scope, $http, $window, $interval) {
    $scope.isShowNumber = false;
    
    $scope.moves = [
        {seq:1, ordinate: {x:8, y:8}},
        {seq:2, ordinate: {x:8, y:9}},
        {seq:3, ordinate: {x:8, y:6}},
        {seq:4, ordinate: {x:9, y:10}},
        {seq:5, ordinate: {x:9, y:6}},
        {seq:6, ordinate: {x:9, y:9}},
        {seq:7, ordinate: {x:7, y:9}},
        {seq:8, ordinate: {x:7, y:8}},
        {seq:9, ordinate: {x:10, y:11}},
        {seq:10, ordinate: {x:11, y:13}}
    ];

    // ----
    // Util
    // ----

    $scope.transOrigToReadableX = function(pX) {
        return String.fromCharCode(97 + pX);
    }

    $scope.transOrigToReadableY = function(pY, boardSize) {
        return '' + (boardSize - pY);
    }

    // ----
    // Data Model
    // ----
    $scope.board = {};

    $scope.board.size = 15;
    $scope.board.width = 480;
    $scope.board.height = 480;
    $scope.board.gridWidth = $scope.board.width / $scope.board.size;
    $scope.board.gridHeight = $scope.board.height / $scope.board.size;

    $scope.board.grids = [$scope.board.size];
    $scope.board.xAxis = [$scope.board.size];

    //Board Background
    for (var y = 0; y < $scope.board.size; y++) {
        $scope.board.grids[y] = [$scope.board.size];
        $scope.board.grids[y].y = y;
        for (var x = 0; x < $scope.board.size; x++) {
            $scope.board.grids[y][x] = {
                ordinate:{x:x, y:y}
            };

            $scope.board.grids[y][x].style = {
                width:  $scope.board.gridWidth,
                height: $scope.board.gridHeight,
//                        position: 'relative',
                backgroundSize:'100%',
                backgroundImage: '',
            };

            //Decide background-image
            var xChar = 'c';
            var yChar = 'c';

            if (y == 0) {
                yChar = 't';
            } else if (y == $scope.board.size - 1) {
                yChar = 'b';
            }
            if (x == 0) {
                xChar = 'l';
            } else if (x == $scope.board.size - 1) {
                xChar = 'r';
            }

            if ((x == 3 || x == $scope.board.size - 4) && 
               (y == 3 || y == $scope.board.size - 4)) {
                xChar = 's'; yChar = 'p';
            } else if (x == Math.floor($scope.board.size / 2) &&
                      y == Math.floor($scope.board.size / 2)) {
                xChar = 's'; yChar = 'p';
            }
            var imgName = 'e' + xChar + yChar;

            $scope.board.grids[y][x].style.backgroundImage = 'url(./images/board/' + imgName + '.gif)';
        }
    }

    // x-axis, y-axis
    for (var i = 0; i < $scope.board.size; i++) {
        $scope.board.xAxis[i] = $scope.transOrigToReadableX(i);
    }

    //
    for (var i in $scope.moves) {
        $scope.board.grids[$scope.moves[i].ordinate.y][
        $scope.moves[i].ordinate.x].move = $scope.moves[i];
    }

    //　----
    //  User Interaction
    //  ----
    $scope.mouseOnBoard = function(grid) {
        console.log('mouseMove on (' + grid.ordinate.x + ', ' + grid.ordinate.y + ')');
//                console.log('previewStoneWidth:' + $scope.board.moveStyle.width);
        //Preview stone
        $scope.board.grids[grid.ordinate.y][grid.ordinate.x].previewMove = true;
    }

    $scope.mouseOutBoard = function(grid) {
        console.log('mouseOut on (' + grid.ordinate.x + ', ' + grid.ordinate.y + ')');
        //Preview stone
        $scope.board.grids[grid.ordinate.y][grid.ordinate.x].previewMove = false;
    }
//    $scope.isMyGame = false;
//    
//    //Board
//    $scope.moveOnOrdinate = {x:-1, y:-1};
//    $scope.moves = [];
//    
//    $scope.board = {
//    };
//    $scope.board.size = 15;
//    $scope.board.width = 480;
//    $scope.board.height = 480;
//    $scope.board.gridWidth = $scope.board.width / $scope.board.size;
//    $scope.board.gridHeight = $scope.board.height / $scope.board.size;
//    
//    $scope.board.boldPoints = [
//        {x:3, y:3}, 
//        {x:3, y:$scope.board.size - 1 - 3}, 
//        {x:$scope.board.size - 1 - 3, y:3}, 
//        {x:$scope.board.size - 1 - 3, y:$scope.board.size - 1 - 3},
//        {x:Math.floor($scope.board.size / 2), y:Math.floor($scope.board.size / 2)}
//    ];//console.log($scope.board.boldPoints);
//    
//    $scope.getNumber = function(num) {
//        return new Array(num);   
//    }
//    
//    $scope.clickOnBoard = function($event) {
//        
////            $scope.goMove($scope.calGridOrdinate($event.offsetX, $event.offsetY));
//        var clickOrdinate = $scope.calGridOrdinate($event.offsetX, $event.offsetY);
//        //Collision detect to other moves.
//        for (var i in $scope.moves) {
//            var move = $scope.moves[i];
//            
//            if (!move.ordiante)
//                continue;
//            if (move.ordinate.x == clickOrdinate.x && move.ordinate.y == clickOrdinate.y) {
//                console.log('Stone already on.');
//                return;
//            }
//        }
//        
//        if ($scope.isMyTurn()) {
//            gameSocket.emit('going', {
//                game_id:$rootScope.game.uid,
//                seq:$scope.moves.length + 1,
//                ordinate:$scope.calGridOrdinate($event.offsetX, $event.offsetY)
//            });
//        } else {
//            console.log('Not my turn / my game');
//        }
//    }
//    
//    $scope.confirmPass = function() {
//        $rootScope.modal.title = 'Pass Confirm';
//        $rootScope.modal.message = 'Want to pass this move?';
//        $rootScope.modal.button1Label = 'Yes';
//        $rootScope.modal.button2Label = 'No';
//        $rootScope.modal.clickButton1 = function() {
//            gameSocket.emit('going', {
//                game_id:$rootScope.game.uid,
//                seq:$scope.moves.length + 1,
//                ordinate:null
//            });
//        }
//        $rootScope.modal.clickButton2 = function() {
//            //Nothing here
//        }
//        $('#modalDialog').modal({
//            keyboard: true
//        });
//    }
//    
//    $scope.confirmDrawRequest = function() {
//        $rootScope.modal.title = 'Draw';
//        $rootScope.modal.message = 'Send Draw Request?';
//        $rootScope.modal.button1Label = 'Yes';
//        $rootScope.modal.button2Label = 'No';
//        $rootScope.modal.clickButton1 = function() {
//            gameSocket.emit('drawRequest', {
//                username:$rootScope.username,
//                game_id:$rootScope.game.uid
//            });
//        }
//        $rootScope.modal.clickButton2 = function() {
//            //Nothing here
//        }
//        $('#modalDialog').modal({
//            keyboard: true
//        });
//    }
//    
//    $scope.confirmResign = function() {
//        $rootScope.modal.title = 'Resign Confirm';
//        $rootScope.modal.message = 'Do you want to resign?';
//        $rootScope.modal.button1Label = 'Yes';
//        $rootScope.modal.button2Label = 'No';
//        $rootScope.modal.clickButton1 = function() {
//            gameSocket.emit('resign', {
//                username:$rootScope.username,
//                game_id:$rootScope.game.uid
//            });
//        }
//        $rootScope.modal.clickButton2 = function() {
//            //Nothing here
//        }
//        $('#modalDialog').modal({
//            keyboard: true
//        });
//    }
//    
//    $scope.mouseOnBoard = function($event) {
////        console.log('(' + $event.offsetX + ', ' + $event.offsetY + ')');
//        $scope.moveOnOrdinate = $scope.calGridOrdinate($event.offsetX, $event.offsetY);
//    }
//    
//    $scope.mouseOutBoard = function() {
//        $scope.moveOnOrdinate = {x:-1, y:-1};
//    }
//    
//    $scope.quitGame = function() {
//        $rootScope.game = null;
//        setCookie('processing-game', null);
//    }
//    
//    // ----
//    // Socket receiver
//    // ----
//    
//    gameSocket.on('connected', function() {
//        console.log('GameSocket connected');
//        gameSocket.emit('join', {
//            username:getCookie('username'),
//            game_id:getCookie('processing-game')
//        });
//    });
//    
//    gameSocket.on('join', function(game) {
//        console.log('On join game:' + game);
//        $rootScope.game = game;
//        $scope.moves = game.moves;
//        $scope.board.size = game.boardSize;
//        if (game.black == $rootScope.username || game.white == $rootScope.username) {
//            $scope.isMyGame = true;
//        }
//    });
//    
//    gameSocket.on('drawAccept', function(game) {
//        $rootScope.message = 'Game draw.';
//        $interval(function () {$scope.message = null;}, 3000, 1);
//    });
//    
//    gameSocket.on('drawReject', function(username) {
//        $rootScope.message = 'Draw request is rejected by ' + username;
//        $interval(function () {$scope.message = null;}, 3000, 1);
//    });
//    
//    gameSocket.on('game-not-exists', function() {
//        console.log('On game-not-exists');
//        $rootScope.message = 'Game not exists.';
//        $interval(function () {$scope.message = null;}, 3000, 1);
//        $rootScope.game = null;
//        setCookie('processing-game', null);
//    });
//    
//    gameSocket.on('going', function(moves) {
//        console.log('On going', moves);
//        $scope.moves = moves;
//    });
//    
//    gameSocket.on('finished', function(game) {
//        console.log('On finished', game);
//        $scope.moves = game.moves;
//        $rootScope.game = game;
//        $rootScope.message = game.result;
//    });
//    
//    // ----
//    //
//    // ----
//    $scope.goMove =  function(pOrdinate) {
//        var newMove = {
//            seq:$scope.moves.length + 1,
//            ordinate:pOrdinate
//        };
//        $scope.moves.push(newMove);
//        return newMove;
//    }
//    
//    $scope.calGridOrdinate = function(x, y) {
////        console.log(x + ' ' + x / $scope.board.gridWidth + ' ' + Math.floor(x / $scope.board.gridWidth) + ' ' + Math.ceil(x / $scope.board.gridWidth))
//        return {x: Math.floor(x / $scope.board.gridWidth), y: Math.floor(y / $scope.board.gridHeight)};
//    }
//    
//    $scope.isMyTurn = function() {
//        if ($scope.moves.length %2 == 0 && getCookie('username') == $scope.game.black)
//            return true;
//        if ($scope.moves.length %2 == 1 && getCookie('username') == $scope.game.white)
//            return true;
//        return false;
//    }
//    
//    $scope.filterNullOrdinate = function(move) {
//        if (move.ordinate === null) {
//            return false;
//        }
//        return true;
//    }
    
});

