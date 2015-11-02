
forbiddenBoardApp = angular.module('forbiddenBoardApp', []);

forbiddenBoardApp.controller('forbiddenBoardController', function ($scope) {
    
    $scope.isShowNumber = false;
    
//    $scope.board.moves = [];
//    $scope.board.moves = $scope.board.moves;
    
//    $scope.board.moves = [
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
        for (var i in $scope.board.moves) {
            $scope.board.grids[$scope.board.moves[i].ordinate.y][
                $scope.board.moves[i].ordinate.x].move = $scope.board.moves[i];
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
    
    $scope.board.moves = [];
    $scope.board.forbiddenPts = [];
    
    // ----
    //
    // ----
    $scope.forbiddenFinder = new ForbiddenFinder($scope.board.size);
    $scope.forbiddenFinder.clear();

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
        $scope.board.previewMove = {seq:$scope.board.moves.length + 1, ordinate:{x:grid.ordinate.x, y:grid.ordinate.y}};
        $scope.board.previewMove.class = "preview-enabled";
    }

    $scope.mouseOutBoard = function(grid) {
        $scope.board.grids.previewMove = null;
    }
    
    $scope.clickOnBoard = function(grid) {
        console.log('click on (' + grid.ordinate.x + ', ' + grid.ordinate.y + ')');
        
        if (grid.move != null)
            return;
        
        var newMove = {seq:$scope.board.moves.length + 1, ordinate:{x:grid.ordinate.x, y:grid.ordinate.y}};
        $scope.board.moves.push(newMove);
        grid.move = newMove;
        newMove.grid = grid;
        
        // clear forbiddenPts
        for (var i = 0; i < $scope.board.forbiddenPts.length; i++) {
            $scope.board.forbiddenPts[i].grid.forbiddenPt = null;
        }
            
        $scope.board.forbiddenPts = $scope.forbiddenFinder.findAllForbiddenPoints($scope.board.moves);
        for (var i = 0; i < $scope.board.forbiddenPts.length; i++) {
            var gridPt = $scope.board.grids[$scope.board.forbiddenPts[i].y][$scope.board.forbiddenPts[i].x];
            //Make cross references.
            gridPt.forbiddenPt = $scope.board.forbiddenPts[i]; // Convinent to html render
            $scope.board.forbiddenPts[i].grid = gridPt;
        }
        
//        $scope.forbiddenFinder.addStone(
//            newMove.ordinate.x, 
//            newMove.ordinate.y,
//            (newMove.seq % 2 == 1) ? ForbiddenFinder.BLACKSTONE : ForbiddenFinder.WHITESTONE
//        );
        
        
    }
    
    $scope.gotoBeginning = function() {
        while ($scope.board.moves.length) {
            var deletedMove = $scope.board.moves.pop();
            deletedMove.grid.move = null;
        }
    }
    
    $scope.gotoPrevious = function() {
        var deletedMove = $scope.board.moves.pop();
        deletedMove.grid.move = null;
    }
    
    $scope.testCompare = function() {
        var a = CPoint(4, 5);
        var b = CPoint(4, 6);
        if (a == b) 
            console.log('equals');
        else
            console.log('not equal');
                        
    }
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

