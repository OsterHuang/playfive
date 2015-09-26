
gamePage = angular.module('gamePage', []);

gamePage.controller('gameController', function ($rootScope, $scope, $http, $window, $interval, socket) {
    $scope.isLocked = false;
    $scope.isShowNumber = false;
    $scope.gameRoomChatOut = {content:''};
    $scope.gameRoomChat = '';
    
    $scope.game = {moves:[], black:{}, white:{}};
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
        if (!$rootScope.user || !$scope.game)
            return false;
        
        if ($scope.game.moves.length %2 == 0 && $scope.game.status === 'started')
            return true;
        return false;
    }
    
    $scope.isWhiteTurn = function() {
        if (!$rootScope.user || !$scope.game)
            return false;
        
        if ($scope.game.moves.length %2 == 1 && $scope.game.status === 'started')
            return true;
        return false;
    }
    
    $scope.transOrigToReadableX = function(pX) {
        return String.fromCharCode(97 + pX);
    }

    $scope.transOrigToReadableY = function(pY, boardSize) {
        return '' + (boardSize - pY);
    }
    
    $scope.clearGridMoves = function() {
        //Board Background
        for (var y = 0; y < $scope.board.size; y++) {
            for (var x = 0; x < $scope.board.size; x++) {
                $scope.board.grids[y][x].move = null;
            }
        }
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

            $scope.board.grids[y][x].style.backgroundImage = 'url(./images/board/' + imgName + '.png)';
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
        if ($scope.isMyTurn()) {
            $scope.board.previewMove.class = "preview-enabled";
        } else {
            $scope.board.previewMove.class = "preview-disabled";
        }
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
        
        if ($scope.game.status != 'started') {
            console.log(' The game is not in active status...');
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
        socket.emit('game-room-chat-send', {from:$rootScope.user.username, gameSeq:$scope.game.seq, content:$scope.gameRoomChatOut.content});
    }
    
    // ---- Game Action ---- Draw, Resign, Undo, Quit
    
    $scope.confirmPass = function() {
        $rootScope.modal.title = 'Pass Confirm';
        $rootScope.modal.message = 'Want to pass this move?';
        $rootScope.modal.button1Label = 'Yes';
        $rootScope.modal.button2Label = 'No';
        $rootScope.modal.clickButton1 = function() {
            socket.emit('game-going', {
                game_id:$rootScope.game.uid,
                seq:$scope.game.moves.length + 1,
                ordinate:null
            });
        }
        $rootScope.modal.clickButton2 = function() {
            //Nothing here
        }
        $('#modalDialog').modal({
            keyboard: true
        });
    }
    
    $scope.confirmDrawRequest = function() {
        $rootScope.modal.title = 'Draw';
        $rootScope.modal.message = 'Send Out Draw Request?';
        $rootScope.modal.button1Label = 'Yes';
        $rootScope.modal.button2Label = 'No';
        $rootScope.modal.clickButton1 = function() {
            socket.emit('game-draw-request', {
                username:$rootScope.user.username,
                game_id:$scope.game.uid
            });
        }
        $rootScope.modal.clickButton2 = function() {
            //Nothing here
        }
        $('#modalDialog').modal({
            keyboard: true
        });
    }
    
    $scope.confirmResign = function() {
        $rootScope.modal.title = 'Resign Confirm';
        $rootScope.modal.message = 'Do you want to resign?';
        $rootScope.modal.button1Label = 'Yes';
        $rootScope.modal.button2Label = 'No';
        $rootScope.modal.clickButton1 = function() {
            socket.emit('game-resign', {
                username:$rootScope.user.username,
                game_id:$scope.game.uid
            });
        }
        $rootScope.modal.clickButton2 = function() {
            //Nothing here
        }
        $('#modalDialog').modal({
            keyboard: true
        });
    }
    
    $scope.confirmUndo = function() {
        $rootScope.modal.title = 'Pass Confirm';
        $rootScope.modal.message = "Want to undo opponent's move?";
        $rootScope.modal.button1Label = 'Yes';
        $rootScope.modal.button2Label = 'No';
        $rootScope.modal.clickButton1 = function() {
            socket.emit('game-undo', {
                game_id:$scope.game.uid
            });
        }
        $rootScope.modal.clickButton2 = function() {
            //Nothing here
        }
        $('#modalDialog').modal({
            keyboard: true
        });
    }
    
    $scope.quitGame = function() {
        socket.emit('game-leave', {joinGame:$scope.game});
    }
    
    $scope.quitWatchedGame = function() {
        socket.emit('game-leave', {joinGame:$scope.game});
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
        $scope.clearGridMoves();
        $scope.arrangeMoves();
    });
    
    socket.on('game-draw-request-receive', function(game) {
        console.log('On game-draw-request-receive', game);
        $rootScope.modal.title = 'Draw';
        $rootScope.modal.message = 'Accept Draw Request?';
        $rootScope.modal.button1Label = 'Accept';
        $rootScope.modal.button2Label = 'Reject';
        $rootScope.modal.clickButton1 = function() {
            console.log('emit game-draw-accept', game);
            socket.emit('game-draw-accept', {
                username:$rootScope.user.username,
                game_id:$scope.game.uid
            });
        }
        $rootScope.modal.clickButton2 = function() {
            console.log('emit game-draw-reject', game);
            socket.emit('game-draw-reject', {
                username:$rootScope.user.username,
                game_id:$scope.game.uid
            });
        }
        $('#modalDialog').modal({
            keyboard: true
        });
    });
//    
//    socket.on('game-draw-accepted', function(game) {
//        $rootScope.message = 'Game draw.';
//        $("#message").alert();
//        $("#message").fadeTo(5000, 500).slideUp(500, function() {});
//    });
    
    socket.on('game-draw-rejected', function(username) {
        $rootScope.message = 'Draw request is rejected by ' + username;
        $("#message").alert();
        $("#message").fadeTo(5000, 500).slideUp(500, function() {});
    });
    
    socket.on('game-not-exists', function() {
        console.log('On game-not-exists');
        $rootScope.message = 'Game not exists.';
        $interval(function () {$scope.message = null;}, 3000, 1);
        $rootScope.game = null;
        setCookie('processing-game', null);
    });
    
    socket.on('game-going-receive', function(moves) {
        console.log('On going', moves, $scope.game.moves);
        $scope.isLocked = false;
//        if (moves.length > $scope.game.moves.length) { //Undo
//            var lastMove = $scope.game.moves.pop();
//            console.log(' Undo move: ', lastMove);
//            $scope.board.grids[lastMove.ordinate.y][lastMove.ordinate.x].move = null;
//        }
        $scope.game.moves = moves;
        $scope.arrangeMoves();
    });
    
    socket.on('game-undo-receive', function(undoMove) {
        console.log('On undo', undoMove);
        $scope.board.grids[undoMove.ordinate.y][undoMove.ordinate.x].move = null;
        console.log(' pop moves', $scope.game.moves.pop());
//        $scope.arrangeMoves();
    });
    
    socket.on('game-finished', function(game) {
        console.log('On finished', game);
        $scope.game = game;
        $scope.arrangeMoves();
        
        $rootScope.message = game.result;
        $("#message").alert();
        $("#message").fadeTo(5000, 500).slideUp(500, function() {});
    });
    
    socket.on('game-leaved', function() {
        console.log('On leaved');
        $rootScope.user.myProgressingGame = null;
    });
    
    socket.on('game-room-chat-receive', function(message) {
        console.log('On game-room-chat-receive', message);
        $scope.gameRoomChat = $scope.gameRoomChat + message.from + ':' + message.content + '\n';
        $scope.gameRoomChatOut.content = '';
    });
    
});

