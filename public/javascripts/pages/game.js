
gamePage = angular.module('gamePage', []);

gamePage.directive('focusOnShow', function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            if ($attr.ngShow){
                $scope.$watch($attr.ngShow, function(newValue){
                    if(newValue){
                        $timeout(function(){
                            $element.focus();
                        }, 0);
                    }
                })      
            }
            if ($attr.ngHide){
                $scope.$watch($attr.ngHide, function(newValue){
                    if(!newValue){
                        $timeout(function(){
                            $element.focus();
                        }, 0);
                    }
                })      
            }

        }
    };
});

gamePage.controller('gameController', function ($rootScope, $scope, $http, $window, $timeout, $interval, socket) {
    

    // ----
    // Util
    // ----
    $scope.intialPage = function() {
        $scope.isLocked = false;
        $scope.isShowNumber = false;
        $scope.gameRoomChatOut = {content:''};
        $scope.gameRoomChat = '';
        $interval.cancel($scope.timeLeft.counting);
        $interval.cancel($scope.timeLeft.syncing);
    }
    
    $scope.intialBoard = function() {
        if ($scope.game) {
            $scope.board.size = $scope.game.boardSize;
        } else {
            $scope.board.size = 15;
        }
        
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
    }
    
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
        
        if ($scope.game.status === 'opening' && $scope.game.tempBlack.username === $rootScope.user.username) {
            return true;
        }
        
        if ($scope.game.status === 'swapping' && $scope.game.white.username === $rootScope.user.username) {
            return true;
        }
        
        if ($scope.game.status === 'alt-making' && $scope.game.black.username === $rootScope.user.username) {
            return true;
        }
        
        if ($scope.game.status === 'alt-choosing' && $scope.game.white.username === $rootScope.user.username) {
            return true;
        }
        
        if ($scope.game.status === 'finished')
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
        
        if ($scope.game.status === 'opening') {
            return true;
        }
        
        if ($scope.game.status === 'alt-making') {
            return true;
        }
        
        if ($scope.game.moves.length %2 == 0 && $scope.game.status === 'started')
            return true;
        return false;
    }
    
    $scope.isWhiteTurn = function() {
        if (!$rootScope.user || !$scope.game)
            return false;
        
        if ($scope.game.status === 'swapping') {
            return true;
        }
        if ($scope.game.status === 'alt-choosing') {
            return true;
        }
        
        if ($scope.game.moves.length %2 == 1 && ($scope.game.status === 'started' || $scope.game.status === 'swapped'))
            return true;
        return false;
    }
    
    $scope.isOpeningEnd = function() {
        if (($scope.game.rule === 'yamaguchi' || $scope.game.rule === 'classic')
                && $scope.game.status === 'opening'
                && $scope.game.moves.length == 3) {
            return true;
        }
        return false;
    }
    
    $scope.toReadable = function(ordinate) {
        return $scope.transOrigToReadableX(ordinate.x) + $scope.transOrigToReadableY(ordinate.y, $scope.game.boardSize);
    }
    
    $scope.transOrigToReadableX = function(pX) {
        return String.fromCharCode(97 + pX);
    }

    $scope.transOrigToReadableY = function(pY, boardSize) {
        return '' + (boardSize - pY);
    }
    
    $scope.validateOpeningStone = function(pCount, pOrdinate) {
        var center = Math.floor($scope.board.size / 2);
        
        if (pCount == 0) {
            if (pOrdinate.x != center || pOrdinate.y != center) {
                $scope.invalidOpeningMsg = '1st move should be at center';
                return;
            }
        } else if (pCount == 1) {
            if (Math.abs(pOrdinate.x - center) > 1 || Math.abs(pOrdinate.y - center) > 1) {
                $scope.invalidOpeningMsg = '2nd move should be aside the center';
                return;
            }
            
        } else if (pCount == 2) {
            if (Math.abs(pOrdinate.x - center) > 2 || Math.abs(pOrdinate.y - center) > 2) {
                $scope.invalidOpeningMsg = '3rd move should be aside the center less than 2 grid';
                return;
            }
        }
        
        $scope.invalidOpeningMsg = null;
    }
    
    $scope.validateSymmetric = function(pOrdinate) {
        if (!$scope.game.alts || $scope.game.alts.length == 0) {
            $scope.invalidOpeningMsg = null;
            return;
        }
            
        var symPoints = [];
        for (var i in $scope.game.alts) {
            //console.log();
            var stones5 = $scope.game.moves.slice();
            stones5.push({seq:5, ordinate:$scope.game.alts[i].ordinate});
            var symPts = symFinder(stones5);
            console.log(" Find points from  ", pOrdinate, symPts);
            Array.prototype.push.apply(symPoints, symPts);
        }
        
        for (var i = 0; i < symPoints.length; i++) {
            console.log(' ' + $scope.toReadable(symPoints[i].ordinate) + ' compare with ' + $scope.toReadable(pOrdinate));
            if (symPoints[i].ordinate.x == pOrdinate.x && symPoints[i].ordinate.y == pOrdinate.y) {
                $scope.invalidOpeningMsg = 'This is a symmetric point with other 5th moves.' + $scope.toReadable(pOrdinate);
                return;
            }
        }
        
        $scope.invalidOpeningMsg = null;
    }
    
    // ----
    // Timer
    // ----
    $scope.countDownTimeLeft = function() {
        $scope.timeLeft.currentTime.setTime($scope.timeLeft.currentTime.getTime() + 1000);
        
//        console.log($scope.game.rule.perMovePlusTime);
        if ($scope.isBlackTurn()) {
            $scope.calculateTimeLeft($scope.timeLeft.black);
            if ($scope.game.timeRule.perMovePlusTime) {
                console.log(' White left time:' + $scope.timeLeft.white.timeLeft);
                $scope.timeLeft.white.countDownString = $scope.toTimeString(Math.round($scope.timeLeft.white.timeLeft));
            }
        } else {
            $scope.calculateTimeLeft($scope.timeLeft.white);
            if ($scope.game.timeRule.perMovePlusTime) {
                console.log(' White left time:' + $scope.timeLeft.white.timeLeft);
                $scope.timeLeft.black.countDownString = $scope.toTimeString(Math.round($scope.timeLeft.black.timeLeft));
            }
        }
    }
    
    $scope.calculateBothTimeLeft = function() {
        $scope.calculateTimeLeft($scope.timeLeft.black);
        $scope.calculateTimeLeft($scope.timeLeft.white);
    }
    
    $scope.calculateTimeLeft = function(whosTimeLeft) {
//        console.log('before whosTimeLeft:', whosTimeLeft);
        var usedTime = Math.floor($scope.timeLeft.currentTime - new Date($scope.game.lastActionTime)) / 1000 - 1;
//        console.log('usedTime:', usedTime);
        // -- 1. Has basic time
        if (whosTimeLeft.timeLeft - usedTime >= 1) {
            whosTimeLeft.countDown = whosTimeLeft.timeLeft - usedTime;
        
        // -- 2. Use up basic time
        } else if (whosTimeLeft.timeLeft - usedTime < 1) {
            // -- 2.1 has perMoveTime
            if ($scope.game.timeRule.perMoveTime) {
                //  -- 2.1.1 Not use up perMoveTime
                if (whosTimeLeft.timeLeft - usedTime + $scope.game.timeRule.perMoveTime > 0) {
                    whosTimeLeft.countDown = whosTimeLeft.timeLeft - usedTime + $scope.game.timeRule.perMoveTime;
                //  -- 2.1.2 Use up perMoveTime
                } else {
                    whosTimeLeft.countDown = 0;
                }
            // -- 2.2 has no perMoveTime
            } else {
                 whosTimeLeft.countDown = 0;
            }
        }
        
//        console.log('after whosTimeLeft:', whosTimeLeft);
        
        whosTimeLeft.countDownString = $scope.toTimeString(Math.floor(whosTimeLeft.countDown));
    }
    
    $scope.syncTimeLeft = function() {
        socket.emit('game-fetch-time');
    }
    
    $scope.toTimeString = function(pSecond) {
        var remaingSecond = pSecond;
        var h = Math.floor(remaingSecond / 3600); remaingSecond = remaingSecond % 3600;
        var m = Math.floor(remaingSecond / 60);   remaingSecond = remaingSecond % 60;
        var s = remaingSecond;
        
        return '' + (h > 0 ? h + 'h' : '') +  (m > 0 ? m + 'm' : '') + s + 's';
    }
    
    $scope.resetTimeLeft = function(game) {
        $scope.timeLeft.currentTime = new Date(game.responseTime); console.log(' Set current time to ' + $scope.timeLeft.currentTime);
        $scope.timeLeft.black.timeLeft = game.blackTimeLeft;
        $scope.timeLeft.white.timeLeft = game.whiteTimeLeft;
        console.log(' New time left... ', $scope.timeLeft);
    }
    
    $scope.isFinalCountDown = function(whosTimeLeft) {
        if (whosTimeLeft.countDown < 6)
            return true;
        return false;
    }
    
    // ----
    // Paint moves
    // ----
    $scope.clearGridMoves = function() {
        //Board Background
        for (var y = 0; y < $scope.board.size; y++) {
            for (var x = 0; x < $scope.board.size; x++) {
                $scope.board.grids[y][x].move = null;
            }
        }
    }
    
    $scope.clearGridAlts = function() {
        //Board Background
        for (var y = 0; y < $scope.board.size; y++) {
            for (var x = 0; x < $scope.board.size; x++) {
                $scope.board.grids[y][x].alt = null;
            }
        }
    }
    
    $scope.arrangeMoves = function() {
        for (var i in $scope.game.moves) {
            var movei = $scope.game.moves[i];
            var gridi = $scope.board.grids[movei.ordinate.y][movei.ordinate.x]
            gridi.move = movei;
        }
        
        if (!$scope.game.alts || $scope.game.status === 'started' || $scope.game.status === 'finished')
            return;
        
        for (var i in $scope.game.alts) {
            var alti = $scope.game.alts[i];
            var gridi = $scope.board.grids[alti.ordinate.y][alti.ordinate.x]
            gridi.alt = alti;
        }
    }

    // ----
    // Data Model
    // ----
    $scope.isLocked = false;
    $scope.isShowNumber = false;
    $scope.invalidOpeningMsg = null;
    
    $scope.gameRoomChatOut = {content:''};
    $scope.gameRoomChat = '';
    $scope.game = {moves:[], black:{}, white:{}, boardSize:15, alts:[]};
    
    $scope.timeLeft = {
        black:{role:'black', timeLeft:0, countDownString:''},
        white:{role:'white', timeLeft:0, countDownString:''},
        currentTime:new Date()
    };
    
    $scope.gridAltChosen;
    
    $scope.board = {};
    $scope.board.size = 15;
    $scope.board.width = 480;
    $scope.board.height = 480;
    $scope.board.gridWidth = $scope.board.width / $scope.board.size;
    $scope.board.gridHeight = $scope.board.height / $scope.board.size;
    $scope.board.grids = [$scope.board.size];
    $scope.board.xAxis = [$scope.board.size];
    $scope.board.txtAltQty = null;

    //　----
    //  User Interaction
    //  ----
    $scope.mouseOnBoard = function(grid) {
//        console.log('mouseMove on (' + grid.ordinate.x + ', ' + grid.ordinate.y + ')');
//                console.log('previewStoneWidth:' + $scope.board.moveStyle.width);
        //Preview stone
        $scope.board.previewMove = {seq:$scope.game.moves.length + 1, ordinate:{x:grid.ordinate.x, y:grid.ordinate.y}};
        if ($scope.isMyTurn() && !($scope.game.status === 'alt-choosing') && !($scope.game.status === 'opening' && $scope.game.moves.length >= 3)) {
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
                
        if ($scope.game.status === 'opened' && $scope.game.status === 'finished') {
            console.log(' The game is not in active status...');
            return;
        }
        
        if (!$scope.isMyTurn()) {
            console.log(' Not your game or your turn.');
            return;
        }
        
        if ($scope.game.status === 'swapping') {
            $rootScope.message = 'Please select white or black first.';
            $("#message").alert();
            $("#message").fadeTo(5000, 500).slideUp(500, function() {});
            return;
        } 
        
        //Has stone
        if (grid.move != null)
            return;
        
        if ($scope.game.status === 'opening' && $scope.game.moves.length >= 3) {
            return;
        } else if ($scope.game.status === 'opening' && $scope.game.moves.length < 3) {
            $scope.validateOpeningStone($scope.game.moves.length, grid.ordinate);
            if ($scope.invalidOpeningMsg)//Validate fails
                return;
        } 
        
        //Has alternatives
        if (grid.alt != null) {
            var idx = $scope.game.alts.indexOf(grid.alt);
            if (idx == -1)
                return;
            
            if ($scope.game.status === 'alt-making') {
                $scope.game.alts.splice(idx, 1);
                grid.alt = null;
                return;
            } else if ($scope.game.status === 'alt-choosing') {
                grid.alt.chosen = true;
                $scope.gridAltChosen = grid;
                return;
            }
        } 
        if ($scope.game.status === 'alt-choosing') {
            return;
        }
        
        if ($scope.game.status === 'alt-making') {
            if (($scope.game.rule === 'classic' || $scope.game.rule === 'yamaguchi' ) && $scope.game.alts && $scope.game.alts.length >= $scope.game.altQty)
                return;
            
            var symMessage = $scope.validateSymmetric(grid.ordinate);
            if ($scope.invalidOpeningMsg) {//Validate fails
                $rootScope.message = $scope.invalidOpeningMsg;
                $("#message").alert();
                $("#message").fadeTo(5000, 500).slideUp(500, function() {});
                return;
            }
            
            grid.alt = {seq:$scope.game.moves.length + 1, ordinate:{x:grid.ordinate.x, y:grid.ordinate.y}};
            if (!$scope.game.alts) {
                $scope.game.alts = [];
            } 
            $scope.game.alts.push(grid.alt);
            
            return;
        }
        
        if ($scope.isLocked == false)
            $scope.board.firstClickMove = {seq:$scope.game.moves.length + 1, ordinate:{x:grid.ordinate.x, y:grid.ordinate.y}};
    }
    
    $scope.confirmNextMove = function() {
        var newMove = $scope.board.firstClickMove;
        $scope.board.firstClickMove = null;
        
//        $scope.game.moves.push(newMove);
//        $scope.board.grids[newMove.ordinate.y][newMove.ordinate.x].move = newMove;
        
        if ($scope.game.status === 'started') {
            $scope.isLocked = true;
            socket.emit('game-going', {
                uid:$scope.game.uid,
                seq:$scope.game.moves.length + 1,
                ordinate:{x:newMove.ordinate.x, y:newMove.ordinate.y}
            });
        } else if ($scope.game.status === 'opening') {
            $scope.game.moves.push({
                seq:$scope.game.moves.length + 1,
                ordinate:{x:newMove.ordinate.x, y:newMove.ordinate.y}
            });
            $scope.arrangeMoves();
        } else if ($scope.game.status === 'swapped') {
            socket.emit('game-alt-making', {
                uid:$scope.game.uid,
                seq:$scope.game.moves.length + 1,
                ordinate:{x:newMove.ordinate.x, y:newMove.ordinate.y}
            });
        }
    }
    
    $scope.cancelNextMove = function() {
        $scope.board.firstClickMove = null;
    }
    
    $scope.confirmOpening = function() {
        if ($scope.game.rule === 'yamaguchi' && !$scope.game.altQty) {
            $rootScope.message = 'Please declare the 5th-n';
            $("#message").alert();
            $("#message").fadeTo(5000, 500).slideUp(500, function() {});
            return;
        }
        
        $scope.isLocked = true;
        socket.emit('game-chosen-open', {
            uid:$scope.game.uid,
            moves:$scope.game.moves,
            altQty:$scope.game.altQty
        });
    }
    
    $scope.undoOpening = function() {
        var undoMove = $scope.game.moves.pop();
        $scope.clearGridMoves();
        $scope.arrangeMoves();
//        if (!undoMove)
//            return;
//        undoMove.grid.move = null;
    }
    
    $scope.confirmSwap = function(isSwapped) {
        socket.emit('game-swapped', {
            uid:$scope.game.uid,
            isSwapped:isSwapped
        });
    }
    
    $scope.confirmAlternatives = function() {
        var alts = [];
        for (var i in $scope.game.alts) {
            alts[i] = {seq:$scope.game.alts[i].seq, ordinate:$scope.game.alts[i].ordinate};
        }
        
        socket.emit('game-alt-choosing', {
            uid:$scope.game.uid,
            alts:alts
        });
    }
    
    $scope.confirmAltChosen = function() {
        if (!$scope.gridAltChosen)
            return;
        
        $scope.isLocked = true;
        socket.emit('game-alt-chosen', {
            uid:$scope.game.uid,
            alt:$scope.gridAltChosen.alt
        });
    }
    
    $scope.cancelAltChosen = function() {
        $scope.gridAltChosen.alt.chosen = false;
        $scope.gridAltChosen = null;
    }
    
    $scope.changeOnAltQty = function() {
//        if (!$scope.board.txtAltQty)
//            return;
        
        var altQty = parseInt($scope.board.txtAltQty, 10);
        if (!altQty || altQty > 20 || altQty < 1) {
            $rootScope.message = 'Please enter a number from 1 to 20';
            $("#message").alert();
            $("#message").fadeTo(5000, 500).slideUp(500, function() {});
            $scope.board.txtAltQty = null;
            $scope.game.altQty = null;
            return;
        }
        
        $scope.game.altQty = altQty;
    }
    
    $scope.chatInGame = function() {
        socket.emit('game-room-chat-send', {from:$rootScope.user.username, gameSeq:$scope.game.seq, content:$scope.gameRoomChatOut.content});
    }
    
    $scope.showStudyBoard = function() {
        window.open("analysis-board.html?moves=" + toMovesString($scope.game.moves, $scope.board.size), "StudyBoard", "height=600, width=600");
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
        $scope.resetTimeLeft(game);
        
        //TODO It should initial all the things
        //$scope.clearGridMoves();
        $scope.intialPage();
        $scope.intialBoard();
        $scope.arrangeMoves();
        
        $scope.calculateBothTimeLeft();
        $scope.timeLeft.counting = $interval($scope.countDownTimeLeft, 1000);
        $scope.timeLeft.syncing  = $interval($scope.syncTimeLeft, 5000);
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
    
    socket.on('game-going-receive', function(game) {
        console.log('On going');
        $scope.isLocked = false;
//        if (moves.length > $scope.game.moves.length) { //Undo
//            var lastMove = $scope.game.moves.pop();
//            console.log(' Undo move: ', lastMove);
//            $scope.board.grids[lastMove.ordinate.y][lastMove.ordinate.x].move = null;
//        }
//        $scope.calculateBothTimeLeft();
        $scope.game = game;
        $scope.resetTimeLeft(game);
//        $scope.calculateBothTimeLeft();
//        $scope.timeLeft.basicTimeup = false;
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
        
        //$scope.calculateBothTimeLeft();
        $timeout(function() {
                $interval.cancel($scope.timeLeft.counting);
                $interval.cancel($scope.timeLeft.syncing);
            },
            5
        );
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
    
    socket.on('game-fetch-time-receive', function(data) {
//        console.log(' time diff:' + Math.abs($scope.timeLeft.currentTime - new Date(data.currentTime)));
        if (Math.abs($scope.timeLeft.currentTime - new Date(data.currentTime)) > 5000)
            $scope.timeLeft.currentTime = new Date(data.currentTime);
    });
    
    // ---- Opening flow ----
    socket.on('game-chosen-open-receive', function(game) {
        console.log('On chosen open', game);
        $scope.isLocked = false;
        $scope.game = game;
        $scope.resetTimeLeft(game);
        $scope.arrangeMoves();
    });
    
    socket.on('game-swapped-receive', function(game) {
        console.log('On swapped', game);
        $scope.game = game;
        $scope.resetTimeLeft(game);
    });
    
    socket.on('game-alt-making-receive', function(game) {
        console.log('On alt-making-receive', game);
        $scope.isLocked = false;
        $scope.game = game;
        $scope.resetTimeLeft(game);
        $scope.arrangeMoves();
    });
    
    socket.on('game-alt-choosing-receive', function(game) {
        console.log('On alt-choosing-receive', game);
        $scope.isLocked = false;
        $scope.game = game;
        $scope.resetTimeLeft(game);
        $scope.arrangeMoves();
    });
    
    socket.on('game-alt-chosen-receive', function(game) {
        console.log('On alt-chosen-receive', game);
        $scope.isLocked = false;
        $scope.game = game;
        $scope.clearGridAlts();
        $scope.resetTimeLeft(game);
        $scope.arrangeMoves();
    });
    
});

function toMovesString(pMoves, pBoardSize) {
    var moveString = '';
    for (var i = 0; i < pMoves.length; i++) {
        moveString = moveString.concat(toReadableFromOrigX(pMoves[i].ordinate.x));
        moveString = moveString.concat(toReadableFromOrigY(pMoves[i].ordinate.y, pBoardSize));
        
        moveString = moveString.concat(',');
    }
    
    if (pMoves.length > 0) {
        moveString = moveString.substr(0, moveString.length - 1);
    }
    return moveString;
}

