
gamePage = angular.module('gamePage', []);

gamePage.controller('gameController', function ($rootScope, $scope, $http, $window, $interval, socket) {
    $scope.isLocked = false;
    $scope.isShowNumber = false;
    $scope.chatOut = 'abc';
    $scope.gameRootChat = '';
//    $scope.game.moves = [];
//    $scope.game.moves = $scope.game.moves;
    
//    $scope.game.moves = [
//        {seq:1, ordinate: {x:8, y:8}},
//        {seq:2, ordinate: {x:8, y:9}},
//        {seq:3, ordinate: {x:8, y:6}},
//        {seq:4, ordinate: {x:9, y:10}},
//        {seq:5, ordinate: {x:9, y:6}},
//        {seq:6, ordinate: {x:9, y:9}},
//        {seq:7, ordinate: {x:7, y:9}},
//        {seq:8, ordinate: {x:7, y:8}},
//        {seq:9, ordinate: {x:10, y:11}},
//        {seq:10, ordinate: {x:11, y:13}}
//    ];

    // ----
    // Util
    // ----
    $scope.isMyGame = function() {
        if (!$rootScope.user || !$scope.game)
            return false;
        
        if ($scope.game.black.username === $rootScope.user.username || $scope.game.white.username === $rootScope.user.username) {
            return true;
        }
        
        return false;
    }
    
    $scope.isMyTurn = function() {
        if (!$rootScope.user || !$scope.game)
            return false;
        
        if ($scope.game.moves.length %2 == 0 && $scope.game.black.username === $rootScope.user.username)
            return true;
        if ($scope.game.moves.length %2 == 1 && $scope.game.white.username === $rootScope.user.username)
            return true;
        return false;
    }
    
    $scope.isBlackTurn = function() {
        if ($scope.game.moves.length %2 == 0)
            return true;
        return false;
    }
    
    $scope.isWhiteTurn = function() {
        if ($scope.game.moves.length %2 == 1)
            return true;
        return false;
    }
    
    $scope.transOrigToReadableX = function(pX) {
        return String.fromCharCode(97 + pX);
    }

    $scope.transOrigToReadableY = function(pY, boardSize) {
        return '' + (boardSize - pY);
    }
    
    $scope.arrangeMoves = function() {
        for (var i in $scope.game.moves) {
            $scope.board.grids[$scope.game.moves[i].ordinate.y][
                $scope.game.moves[i].ordinate.x].move = $scope.game.moves[i];
        }
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
//    arrangeMoves();

    //　----
    //  User Interaction
    //  ----
    $scope.mouseOnBoard = function(grid) {
//        console.log('mouseMove on (' + grid.ordinate.x + ', ' + grid.ordinate.y + ')');
//                console.log('previewStoneWidth:' + $scope.board.moveStyle.width);
        //Preview stone
        $scope.board.previewMove = {seq:$scope.game.moves.length + 1, ordinate:{x:grid.ordinate.x, y:grid.ordinate.y}};
    }

    $scope.mouseOutBoard = function(grid) {
//        console.log('mouseOut on (' + grid.ordinate.x + ', ' + grid.ordinate.y + ')');
        //Preview stone
        $scope.board.grids.previewMove = null;
//        $scope.board.grids[grid.ordinate.y][grid.ordinate.x].firstClickMove = false;
    }
    
    $scope.clickOnBoard = function(grid) {
        console.log('click on (' + grid.ordinate.x + ', ' + grid.ordinate.y + ')');
        
        if (!$scope.isMyTurn()) {
            console.log(' Not your game or your turn.');
            return;
        }
        
        //Preview stone
        if (grid.move != null)
            return;
        if ($scope.isLocked == false)
            $scope.board.firstClickMove = {seq:$scope.game.moves.length + 1, ordinate:{x:grid.ordinate.x, y:grid.ordinate.y}};
    }
    
    $scope.confirmNextMove = function() {
        var newMove = $scope.board.firstClickMove;
        $scope.board.firstClickMove = null;
        
//        $scope.game.moves.push(newMove);
//        $scope.board.grids[newMove.ordinate.y][newMove.ordinate.x].move = newMove;
        
        socket.emit('game-going', {
            uid:$scope.game.uid,
            seq:$scope.game.moves.length + 1,
            ordinate:{x:newMove.ordinate.x, y:newMove.ordinate.y}
        });
    }
    
    $scope.chatInGame = function() {
        socket.emit('game-room-chat-send', {from:$rootScope.user.username, gameSeq:$scope.game.seq, content:$scope.chatOut});
    }
    
    // ----
    // Socket receiver
    // ----
    socket.on('game-join', function(game) {
        console.log('game-join - ' + game.seq, game);
        $rootScope.message = 'Join Game No.' + game.seq;
        $("#message").alert();
        $("#message").fadeTo(5000, 500).slideUp(500, function() {});
                
        $scope.game = game;
        $rootScope.user.myProgressingGame = game; // --> For the main.html show, hide div
        $scope.arrangeMoves();
    });
    
    socket.on('game-drawAccepted', function(game) {
        $rootScope.message = 'Game draw.';
        $("#message").alert();
        $("#message").fadeTo(5000, 500).slideUp(500, function() {});
    });
    
    socket.on('game-drawReject', function(username) {
        $rootScope.message = 'Draw request is rejected by ' + username;
        $interval(function () {$scope.message = null;}, 3000, 1);
    });
    
    socket.on('game-not-exists', function() {
        console.log('On game-not-exists');
        $rootScope.message = 'Game not exists.';
        $interval(function () {$scope.message = null;}, 3000, 1);
        $rootScope.game = null;
        setCookie('processing-game', null);
    });
    
    socket.on('game-going-receive', function(moves) {
        console.log('On going', moves);
        $scope.isLocked = false;
        $scope.game.moves = moves;
        $scope.arrangeMoves();
    });
    
    socket.on('game-finished', function(game) {
        console.log('On finished', game);
        $scope.game.moves = game.moves;
        $scope.game = game;
        $rootScope.message = game.result;
    });
    
    socket.on('game-room-chat-receive', function(message) {
        console.log('On game-root-chat-receive', message);
        $scope.gameRootChat = $scope.gameRootChat + message.from + ':' + message.content + '\n';
    });
    
    
//    $scope.isMyGame = false;
//    
//    //Board
//    $scope.moveOnOrdinate = {x:-1, y:-1};
//    $scope.game.moves = [];
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
//        for (var i in $scope.game.moves) {
//            var move = $scope.game.moves[i];
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
//                seq:$scope.game.moves.length + 1,
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
//                seq:$scope.game.moves.length + 1,
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
//        $scope.game.moves = game.moves;
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
//        $scope.game.moves = moves;
//    });
//    
//    gameSocket.on('finished', function(game) {
//        console.log('On finished', game);
//        $scope.game.moves = game.moves;
//        $rootScope.game = game;
//        $rootScope.message = game.result;
//    });
//    
//    // ----
//    //
//    // ----
//    $scope.goMove =  function(pOrdinate) {
//        var newMove = {
//            seq:$scope.game.moves.length + 1,
//            ordinate:pOrdinate
//        };
//        $scope.game.moves.push(newMove);
//        return newMove;
//    }
//    
//    $scope.calGridOrdinate = function(x, y) {
////        console.log(x + ' ' + x / $scope.board.gridWidth + ' ' + Math.floor(x / $scope.board.gridWidth) + ' ' + Math.ceil(x / $scope.board.gridWidth))
//        return {x: Math.floor(x / $scope.board.gridWidth), y: Math.floor(y / $scope.board.gridHeight)};
//    }
//    
//    $scope.isMyTurn = function() {
//        if ($scope.game.moves.length %2 == 0 && getCookie('username') == $scope.game.black)
//            return true;
//        if ($scope.game.moves.length %2 == 1 && getCookie('username') == $scope.game.white)
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

