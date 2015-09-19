var zTool = require('./zTool.js');

//Use map to stroe processing games
var processingGames = new zTool.SimpleMap();

var findGame = function(uid) {
    return processingGames.get(uid);
}

var listGames = function() {
    return processingGames.values();
}

var listCreatedGames = function() {
    var ret = [];
//    console.log('listCreatedGames() - ' + processingGames.size + ' ' + processingGames.length);
    var games = processingGames.values();
    for (var i = 0; i < games.length; i++) {
        //console.log('listCreatedGames() - The game status is ' + games[i].status + '.' + (games[i].status === 'opened'));
        if (games[i].status === 'opened') {
            ret.push(games[i]); 
        }
    }
    
    return ret;
}

var listProgressingGames = function() {
    var ret = [];
//    console.log('listProgressingGames() - ' + processingGames.size + ' ' + processingGames.length);
    var games = processingGames.values();
    for (var i = 0; i < games.length; i++) {
        //console.log('listProgressingGames() - The game status is ' + games[i].status + '.' + (games[i].status === 'started'));
        if (games[i].status === 'started') {
            ret.push(games[i]); 
        }
    }
    
    return ret;
}

var addGame = function(newGame) {
    console.log("Add User:" + processingGames.put(newGame.uid, newGame));
}

var removeGame = function(uid) {
    processingGames.remove(uid);
}

var count = function() {
    processingGames.size();
}

var win = function(boardSize, moves) {
    if (!moves || moves.length < 1) { // Illegal Parameters
        return false;
    }
    
    if (moves[moves.length - 1].ordinate == null) { // Pass Move
        return false;
    }
    
    var forWhoWin = (moves.length % 2);
    
    var board = [];
    for (var y = 0; y < boardSize; y++) {
        board[y] = [];
        for (var x = 0; x < boardSize; x++) {
            board[y][x] = false;
        }
    }
    
    for (var i in moves) {
        var move = moves[i];
        if (move.seq % 2 == forWhoWin) {
            if (move.ordinate) //Pass or not
                board[move.ordinate.y][move.ordinate.x] = true; // Has white or black stone
        }
    }
    
    //Last 4 x, y moves will not connect in five.
    for (var y = 0; y < boardSize - 4; y++) {  
        for (var x = 0; x < boardSize - 4; x++) {
            if (board[y][x] == true) { // Hash stone
                var hasFive = findSeq(x, y, board);
                if (hasFive)
                    return true;
            }
        }
    }
    
    return false;
}

var findSeq = function (startX, startY, board) {// Find the five stones in sequence by the direction, right / right-down / down
    var isFive = true;
    //Right
    for (var i = 1; i < 5; i++) {
        if (board[startY][startX + i] == false) {
            isFive = false;
            break;
        }
    }
    if (isFive)
        return true;
    
    //Right-down
    isFive = true;
    for (var i = 1, j = 1; i < 5; i++, j++) {
        if (board[startY + j][startX + i] == false) {
            isFive = false;
            break;
        }
    }
    if (isFive)
        return true;
    
    //Left-down
    if (startX >= 4) {
        isFive = true;
        for (var i = 1, j = 1; j < 5; i++, j++) {
            if (board[startY + j][startX - i] == false) {
                isFive = false;
                break;
            }
        }
        if (isFive)
            return true;
    }
    
    //Down
    isFive = true;
    for (var j = 1; j < 5; j++) {
        if (board[startY + j][startX] == false) {
            isFive = false;
            break;
        }
    }
    if (isFive)
        return true;
    
    return false;
}
                        

module.exports.findGame = findGame;

module.exports.listGames = listGames;
module.exports.listCreatedGames = listCreatedGames;
module.exports.listProgressingGames = listProgressingGames;

module.exports.addGame = addGame;
module.exports.removeGame = removeGame;
module.exports.count = count;

module.exports.win = win;

