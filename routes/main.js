var express = require('express');
var util = require('util');
var hat = require('hat');
var io = require('../my_modules/my-socket');
var MongoClient = require('mongodb').MongoClient;
var m_onlineUsers = require('../my_modules/online-users');
var m_processingGames = require('../my_modules/processing-games');
var router = express.Router();

var forbiddenFinder = new (require('../my_modules/forbidden-finder').ForbiddenFinder)(15);

console.log('Insert counters...');
MongoClient.connect('mongodb://localhost:27017/playfive', function (err, db) {
    if (err) {
        console.log(' Can not connect db on route.main.js.');
        return;
    }

    db.collection('counter').insert(
        { _id: 'game', next: 1},
        function(err, doc) {
            if (err) {
                console.log(' Insert game counter error - ' + err.message);
            } else {
                console.log(' Insert game counter success - seq value:' + doc.next);
            }
        }
    );
    
     db.collection('counter').insert(
        { _id: 'announce', next: 1},
        function(err, doc) {
            if (err) {
                console.log(' Insert game counter error - ' + err.message);
            } else {
                console.log(' Insert game counter success - seq value:' + doc.next);
            }
        }
    );

});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

io.on('connection', function (socket) {
    console.log("New Connection:" + socket.id);
    
    socket.emit('connected');
    
    socket.on('online', function(user) {
        console.log("Socket on online() " + user.username);
        var alreadyInUser = m_onlineUsers.findUser('' + user.username);
        console.log("User List: " + util.inspect(m_onlineUsers.listUsers(), {showHidden: false, depth: null}));
        console.log("Already has user? " + util.inspect(alreadyInUser, {showHidden: false, depth: null}));
        
        if (!alreadyInUser) {
            var newUser = {
                    username:user.username, 
                    nickname:user.nickname,
                    socketId:socket.id
                };
            m_onlineUsers.addUser(newUser);
        } else {
            if (io.sockets.connected[alreadyInUser.socketId]) {
                io.sockets.connected[alreadyInUser.socketId].disconnect();
            }
            alreadyInUser.socketId = socket.id;
        }
        socket.username = user.username;
        
        io.emit('lobby-user-list', { onlineUsers: m_onlineUsers.listUsers() });
        io.emit('lobby-game-list', { createdGames: m_processingGames.listCreatedGames(), progressingGames: m_processingGames.listProgressingGames()});
    });
    
    socket.on('lobby-create-game', function(data) {
        console.log("On lobby-game-created: (" + socket.username + ", " + socket.room + ")", data);
        
        MongoClient.connect('mongodb://localhost:27017/playfive', function (err, db) {
            if (err) {
                console.log(' Can not connect db.');
                socket.emit('message', {message:err.message})
                return;
            }
            
            db.collection('counter').findAndModify(
                { _id: 'game' },
                ['next'],
                { $inc: { next: 1 } },
                { updatedExisting : true }, 
                function(err, doc) {
                    if (err) {
                        console.log(' Find and upsert counter error - ' + err.message);
                        socket.emit('message', {message:err.message});
                        return;
                    }
                    
                    console.log(' After got sequence - ' + util.inspect(doc, {showHidden: false, depth:null}));
                    //Time from string to int (unit:seconds)
                    if (data.newGame.timeRule.basicTime) {
                        data.newGame.timeRule.basicTime = parseInt(data.newGame.timeRule.basicTime, 10);
                    }
                    if (data.newGame.timeRule.perMoveTime) {
                        data.newGame.timeRule.perMoveTime = parseInt(data.newGame.timeRule.perMoveTime, 10);
                    }
                    if (data.newGame.timeRule.perMovePlusTime) {
                        data.newGame.timeRule.perMovePlusTime = parseInt(data.newGame.timeRule.perMovePlusTime, 10);
                    }

                    var newGame = {
                        seq:doc.value.next,
                        uid:hat(),
                        creator:data.newGame.creator,
                        rule:data.newGame.rule,
                        timeRule:data.newGame.timeRule,
                        boardSize:15,
                        status:'opened',
                        winner:null,
                        black:null,
                        white:null,
                        isTempBlack:data.newGame.isTentitiveBlack,
                        isRating:data.newGame.isRating,
                        tempBlack:null,
                        observers:[],
                        moves:[]
                    };
                    
                    m_processingGames.addGame(newGame);

                    io.emit('lobby-game-list', { 
                        createdGames: m_processingGames.listCreatedGames(), 
                        progressingGames: m_processingGames.listProgressingGames()});
                }
            );
            
        });
        
    });
    
    socket.on('lobby-cancel-game', function(data) {
        console.log("On lobby-cancel-game: (" + socket.username + ", " + socket.room + ")", data);
        m_processingGames.removeGame(data.uid);
        io.emit('lobby-game-list', { createdGames: m_processingGames.listCreatedGames(), progressingGames: m_processingGames.listProgressingGames()});
    });
    
    socket.on('lobby-start-game', function(data) {
        console.log("On lobby-start-game: (" + socket.username + ", " + socket.room + ")", data);
        
        var joinGame = m_processingGames.findGame(data.joinGame.uid); 
        console.log('Start-game: ' + util.inspect(joinGame, {showHidden: false, depth:null}));
        
        var creator = m_onlineUsers.findUser(joinGame.creator.username);
        var participant = m_onlineUsers.findUser(data.participant);
        //Determine who is black
        if (joinGame.isTempBlack) {
            joinGame.tempBlack = {nickname:creator.nickname, username:creator.username};
            joinGame.black = {nickname:creator.nickname, username:creator.username};
            joinGame.white = {nickname:participant.nickname, username:participant.username};
        } else {
            joinGame.tempBlack = {nickname:participant.nickname, username:participant.username};
            joinGame.black = {nickname:participant.nickname, username:participant.username};
            joinGame.white = {nickname:creator.nickname, username:creator.username};
        }
        // -- Determine timeLeft **** unit:second **** --
        if (joinGame.timeRule.basicTime) {
            joinGame.blackTimeLeft = joinGame.timeRule.basicTime * 60;
            joinGame.whiteTimeLeft = joinGame.timeRule.basicTime * 60;
        } else {
            joinGame.blackTimeLeft = 0;
            joinGame.whiteTimeLeft = 0;
        }
        
        //
        joinGame.startTime = new Date();
        joinGame.lastActionTime = new Date();
        
        if (joinGame.rule === 'classic' || joinGame.rule === 'yamaguchi')
            joinGame.status = "opening";
        else 
            joinGame.status = "started";
        
        console.log('After Start-game: ' + util.inspect(joinGame, {showHidden: false, depth:null}));
        io.emit('lobby-game-list', { createdGames: m_processingGames.listCreatedGames(), progressingGames: m_processingGames.listProgressingGames()});
    });
    
    socket.on('lobby-join-game', function(data) {
        console.log("On lobby-join-game: (" + socket.username + ", " + socket.room + ")", data);
        var joinGame = m_processingGames.findGame(data.joinGame.uid); 
        joinGame.responseTime = new Date();
        
        socket.room = 'room_' + joinGame.seq;
        socket.join(socket.room);
        socket.emit('game-join', joinGame);
    });
    
    socket.on('lobby-watch-game', function(data) {
        console.log("On lobby-watch-game: (" + socket.username + ", " + socket.room + ")", data);
        
        var watchGame = m_processingGames.findGame(data.watchGame.uid); 
        console.log('Watch-game: ' + util.inspect(watchGame, {showHidden: false, depth:null}));
        
        socket.room = 'room_' + watchGame.seq;
        socket.join(socket.room);
        
        socket.emit('lobby-watched-game', watchGame);
    });
    
    socket.on('lobby-chat-send', function(data) {
        console.log("On lobby-chat-send: (" + socket.username + ", " + socket.room + ")" + util.inspect(data, {showHidden: false, depth:null}));
        io.sockets.emit('lobby-chat-receive', data);
    });
    
    socket.on('game-room-chat-send', function(data) {
        console.log("On game-room-chat-send: (" + socket.username + ", " + socket.room + ")", data);
        //io.to('room_' + data.gameSeq).emit('game-room-chat-receive', data);
        io.sockets["in"]('room_' + data.gameSeq).emit('game-room-chat-receive', data);
    });
    
    socket.on('game-fetch-time', function(data) {
        socket.emit('game-fetch-time-receive', {currentTime:new Date()});
    });
    
    socket.on('game-going', function(data) {
        console.log("On going: (" + socket.username + ", " + socket.room + ")", data);
        var game = m_processingGames.findGame(data.uid);
        console.log(" Game going: " + util.inspect(game, {showHidden: false, depth: null}));
        
        //Only active game could go next move.
        if (game.status != 'started') {
            return;
        }
        if (game.black.username != socket.username && game.white.username != socket.username) {
            console.log(' Not the user game.');
            socket.emit('message', {message:'This is not your game.'});
            return;
        }
        
        //is timeout?
        var uTime = calculateTimeLeft(game);
        if (uTime.availableTimeLeft <= 0) {
            gameTimeout(game, uTime);
            io.sockets["in"]('room_' + game.seq).emit('game-finished', game);
            return;
        }
        gameContinue(game, uTime);
        
        game.moves.push({
            seq: data.seq,
            ordinate: data.ordinate
        });
        
        var isRenju = (game.rule === 'gomoku' ? false : true);
        var finishedResult = forbiddenFinder.isGameFinished(game.moves, game.boardSize, isRenju, false);
        if (finishedResult.isFinished) {
            game.status = 'finished';
            game.winner = finishedResult.winner === 'black' ? game.black : game.white;
            game.result = finishedResult.reason;
            
            saveGame(game);
            
            io.sockets["in"]('room_' + game.seq).emit('game-finished', game);
        } else {
            io.sockets["in"]('room_' + game.seq).emit('game-going-receive', game);
        }
    });
    
    socket.on('game-undo', function(data) {
//        console.log("On undo: (" + socket.username + ", " + socket.room + ")", data);
//        var game = m_processingGames.findGame(data.game_id);
//        console.log(" Game undo: " + util.inspect(game, {showHidden: false, depth: null}));
//        
//        //Only active game could go next move.
//        if (game.status != 'started') {
//            return;
//        }
//        if (game.black.username != socket.username && game.white.username != socket.username) {
//            console.log(' Not the user game.');
//            socket.emit('message', {message:'This is not your game.'});
//            return;
//        }
//        
//        var undoMove = game.moves.pop();
//        
//        io.sockets["in"]('room_' + game.seq).emit('game-undo-receive', undoMove);
    });
    
    socket.on('game-draw-request', function(data) {
        console.log("On draw-request: (" + socket.username + ", " + socket.room + ")", data);
        var me = m_onlineUsers.findUser(data.username);
        var game = m_processingGames.findGame(data.game_id);
        console.log(" game-draw-request: ", game);
        var blackUser = m_onlineUsers.findUser(game.black.username);
        var whiteUser = m_onlineUsers.findUser(game.white.username);
                
        if (blackUser.username == me.username) {
            io.to(whiteUser.socketId).emit('game-draw-request-receive', whiteUser.username);
        } else if (whiteUser.username == me.username) {
            io.to(blackUser.socketId).emit('game-draw-request-receive', blackUser.username);
        }
    });
              
    socket.on('game-draw-accept', function(data) {
        console.log("On drawAccept: (" + socket.username + ", " + socket.room + ")", data);
        var me = m_onlineUsers.findUser(data.username);
        var game = m_processingGames.findGame(data.game_id);
//        var blackUser = m_onlineUsers.findUser(game.black);
//        var whiteUser = m_onlineUsers.findUser(game.white);
        
        game.status = 'finished';
        game.result = 'Draw';
        
        saveGame(game);
        
        console.log(' Change game status to draw:', game);
                
        io.sockets["in"](socket.room).emit('game-finished', game);
    });
        
    socket.on('game-draw-reject', function(data) {
        console.log("On drawReject: (" + socket.username + ", " + socket.room + ")", data);
        var me = m_onlineUsers.findUser(data.username);
        var game = m_processingGames.findGame(move.game_id);
        console.log(" Game: " + util.inspect(game, {showHidden: false, depth: null}));
        var blackUser = m_onlineUsers.findUser(game.black);
        var whiteUser = m_onlineUsers.findUser(game.white);
                
        if (blackUser.username == me.username) {
            io.to(whiteUser.socketId).emit('game-draw-rejected', whiteUser.username);
        } else if (whiteUser.username == me.username) {
            io.to(blackUser.socketId).emit('game-draw-rejected', blackUser.username);
        }
    });
    
    socket.on('game-resign', function(data) {
        console.log("On resign: (" + socket.username + ", " + socket.room + ")", data);
        var me = m_onlineUsers.findUser(data.username);
        var game = m_processingGames.findGame(data.game_id);
        console.log(" Game: " + util.inspect(game, {showHidden: false, depth: null}));
        
        game.winner = (data.username == game.black.username) ? game.white : game.black;
        game.status = 'finished';
        game.result = ((data.username == game.black.username) ? 'Black' : 'White') + ' resigned.';
        
        saveGame(game);
                
        io.sockets["in"](socket.room).emit('game-finished', game);
    });
    
    socket.on('game-leave', function(data) {
        console.log("On game-leave: (" + socket.username + ", " + socket.room + ")", data);
        socket.leave(socket.room); //Leave game room
        socket.emit('game-leaved');
    });
    
    socket.on('disconnect', function() {
        console.log("On disconnect: where connection socket.id = (" + socket.username + ")" + socket.id);
        console.log(' Online users: ' + util.inspect(m_onlineUsers.listUsers(), {showHidden: false, depth: null}));
        
        var me;
        var onlineUsers = m_onlineUsers.listUsers();
        for (var i in onlineUsers) {
            if (onlineUsers[i].socketId === socket.id) {
                me = onlineUsers[i];
                break;
            }
        }
        
        console.log(" Leave lobby: ", me);
        if (me && me.username)
            m_onlineUsers.removeUser(me.username);
        
        socket.leave(socket.room);
        socket.room = null;
        
        io.sockets.emit('lobby-user-list', { onlineUsers: m_onlineUsers.listUsers() });
    });
    
    /**
      ---- Classic(rif rule), yamaguchi rule ----
      Inverse flow of game-status / by event: / 
        opening      / by lobby-game-start  / 
        swaping      / by game-chosen-open  / 
        swapped      / by game-swapped      /
        alt-making   / by game-alt-making   /
        alt-choosing / by game-alt-choosing /
        started      / by game-alt-chosen   /
        
      ...Reverse flow of game-status by undo event at seq
      ... opening / game-undo 
    **/
    socket.on('game-chosen-open', function(data) {
        console.log("On game-chosen-open: (" + socket.username + ", " + socket.room + ")", data);
        var game = m_processingGames.findGame(data.uid);
        console.log(" Game going: " + util.inspect(game, {showHidden: false, depth: null}));
        
        //Only active game could go next move.
        if (game.status != 'opening') {
            return;
        }
        if (game.black.username != socket.username && game.white.username != socket.username) {
            console.log(' Not the user game.');
            socket.emit('message', {message:'This is not your game.'});
            return;
        }
        if (game.tempBlack.username != socket.username) {
            console.log(' Not the tentitive black.');
            socket.emit('message', {message:'You can not decide the opening'});
            return;
        }
        
        //is timeout?
        var uTime = calculateTimeLeft(game);
        if (uTime.availableTimeLeft <= 0) {
            gameTimeout(game, uTime);
            io.sockets["in"]('room_' + game.seq).emit('game-finished', game);
            return;
        }
        gameContinue(game, uTime);
        
        Array.prototype.push.apply(game.moves, data.moves); // console.log(' After apply: ', game.moves);
        game.status = 'swapping'
        if (game.rule === 'classic')
            game.altQty = 2;
        else if (game.rule === 'yamaguchi')
            game.altQty = data.altQty;
        
        io.sockets["in"]('room_' + game.seq).emit('game-chosen-open-receive', game);
    });
    
    socket.on('game-swapped', function(data) {
        console.log("On game-swapped: (" + socket.username + ", " + socket.room + ")", data);
        var game = m_processingGames.findGame(data.uid);
        
        //Validation
        if (game.status != 'swapping') {
            return;
        }
        if (game.black.username != socket.username && game.white.username != socket.username) {
            console.log(' Not the user game.');
            socket.emit('message', {message:'This is not your game.'});
            return;
        }
        if (game.white.username != socket.username) {
            console.log(' Not the tentitive white.');
            socket.emit('message', {message:'You can not do the swapping action.'});
            return;
        }
        
        //
        game.status = 'swapped';
        if (data.isSwapped) {
            console.log('Before swap, black / white ', game.black, game.white);
            var tempBlack = game.black;
            game.black = game.white;
            game.white = tempBlack;
            
            //is timeout?
            var uTime = calculateTimeLeft(game);
            if (uTime.availableTimeLeft <= 0) {
                gameTimeout(game, uTime);
                io.sockets["in"]('room_' + game.seq).emit('game-finished', game);
                return;
            }
        gameContinue(game, uTime);
            
            console.log('After swap, black / white ', game.black, game.white);
        }
        
        io.sockets["in"]('room_' + game.seq).emit('game-swapped-receive', game);
    });
    
    socket.on('game-alt-making', function(data) {
        console.log("On game-alt-making: (" + socket.username + ", " + socket.room + ")", data);
        var game = m_processingGames.findGame(data.uid);
        console.log(" game-alt-making: " + util.inspect(game, {showHidden: false, depth: null}));
        
        //Only active game could go next move.
        if (game.status != 'swapped') {
            return;
        }
        if (game.black.username != socket.username && game.white.username != socket.username) {
            console.log(' Not the user game.');
            socket.emit('message', {message:'This is not your game.'});
            return;
        }
        
        //is timeout?
        var uTime = calculateTimeLeft(game);
        if (uTime.availableTimeLeft <= 0) {
            gameTimeout(game, uTime);
            io.sockets["in"]('room_' + game.seq).emit('game-finished', game);
            return;
        }
        gameContinue(game, uTime);
        
        game.moves.push({
            seq: data.seq,
            ordinate: data.ordinate
        });
        game.status = 'alt-making';
        
        io.sockets["in"]('room_' + game.seq).emit('game-alt-making-receive', game);
    });
    
    socket.on('game-alt-choosing', function(data) {
        console.log("On game-alt-choosing: (" + socket.username + ", " + socket.room + ")", data);
        var game = m_processingGames.findGame(data.uid);
        console.log(" game-alt-choosing: " + util.inspect(game, {showHidden: false, depth: null}));
        
        //Only active game could go next move.
        if (game.status != 'alt-making') {
            return;
        }
        if (game.black.username != socket.username && game.white.username != socket.username) {
            console.log(' Not the user game.');
            socket.emit('message', {message:'This is not your game.'});
            return;
        }
        
        //is timeout?
        var uTime = calculateTimeLeft(game);
        if (uTime.availableTimeLeft <= 0) {
            gameTimeout(game, uTime);
            io.sockets["in"]('room_' + game.seq).emit('game-finished', game);
            return;
        }
        gameContinue(game, uTime);
        
        game.alts = data.alts;
        game.status = 'alt-choosing';
        
        io.sockets["in"]('room_' + game.seq).emit('game-alt-choosing-receive', game);
    });
    
    socket.on('game-alt-chosen', function(data) {
        console.log("On alt-chosen: (" + socket.username + ", " + socket.room + ")", data);
        var game = m_processingGames.findGame(data.uid);
        console.log(" Game alt-chosen: " + util.inspect(game, {showHidden: false, depth: null}));
        
        //Only active game could go next move.
        if (game.status != 'alt-choosing') {
            return;
        }
        if (game.black.username != socket.username && game.white.username != socket.username) {
            console.log(' Not the user game.');
            socket.emit('message', {message:'This is not your game.'});
            return;
        }
        
        //is timeout?
        var uTime = calculateTimeLeft(game);
        if (uTime.availableTimeLeft <= 0) {
            gameTimeout(game, uTime);
            io.sockets["in"]('room_' + game.seq).emit('game-finished', game);
            return;
        }
        gameContinue(game, uTime);
        
        game.moves.push({
            seq: data.alt.seq,
            ordinate: data.alt.ordinate
        });
        game.status = 'started';
        
        for (var i in game.atls) {
            var alt = game.alts[i];
            if (alt.seq == data.alt.seq && alt.ordinate.x == data.alt.ordinate.x && alt.ordinate.y == data.alt.ordinate.y) {
                alt.chosen = true;
                break;
            }
        }
        
        io.sockets["in"]('room_' + game.seq).emit('game-alt-chosen-receive', game);
    });
    
    // ---- Check timeout every 5 seconds ----
    function tickTimeout() {
        var progressingGames = m_processingGames.listProgressingGames();
        var inGameList = [];
        
        for (var i in progressingGames) {
            var timing = calculateTimeLeft(progressingGames[i])
            if (timing.availableTimeLeft <= 0) {
                gameTimeout(progressingGames[i], timing);
                io.sockets["in"]('room_' + progressingGames[i].seq).emit('game-finished', progressingGames[i]);
                
                //Array.prototype.push.apply(inGameList, io.sockets.clients('room_' + progressingGames[i].seq))
            }
        }
        
        if (inGameList.length > 0) {
            //clients = io.sockets.clients();
            //console.log(' sockets', util.inspect(io.sockets, {showHidden: false, depth: null}));
            //console.log(' inGameList', util.inspect(inGamesList, {showHidden: false, depth: null}));
            io.emit('lobby-game-list-refresh', 
                { createdGames: m_processingGames.listCreatedGames(), progressingGames: m_processingGames.listProgressingGames()}
            );
        }
    }
    setInterval(tickTimeout, 5000)
});

function saveGame(pGame) {
    console.log('saveGame seq:', pGame.seq);
    
    MongoClient.connect('mongodb://localhost:27017/playfive', function (err, db) {
        if (err) {
            console.log(' Can not connect db on route.main.js to save game....');
            return;
        }

        db.collection('game').insert(
            pGame,
            function(err, doc) {
                if (err) {
                    console.log(' Insert game error - ' + err.message);
                } else if (doc.result.ok == 1 && doc.result.n > 0) {
                    console.log(' Insert game success - seq value:', doc.ops[0]);
                    if (doc.ops[0].isRating) {
                        summarizeRatingInfo(doc.ops[0]);
                    }
                }
            }
        );

    });
}

function summarizeRatingInfo(pGame) {
    console.log('summarizeRatingInfo()', pGame.seq);
    
    MongoClient.connect('mongodb://localhost:27017/playfive', function (err, db) {
        if (err) {
            console.log(' Can not connect db on route.main.js to save game....');
            return;
        }
        
//        var user_black;
//        var user_white;
//        var findBlack = function (err, pUserBlack) {
//            console.log('findBlack err: %o, pUserBlack %o', err, pUserBlack);
//            if (err) {
//                return;
//            }
//            user_black = pUserBlack;
//            db.collection('user').findOne({username:pGame.white.username},findWhite);
//        }
//        
//        var findWhite = function (err, pUserWhite) {
//            console.log('findWhite err: %o, pUserBlack %o', err, pUserWhite);
//            if (err) {
//                return;
//            }
//            user_white = pUserWhite;
//            caculateAndUpdate();
//        }
        
        var updateUserRateInfo = function(pUser, isWon, isLost, isDraw, pScoreUpDown) {
            if (isWon) {
                db.collection('user').update({username:pUser.username},  {$inc:{win:1, rating:10}});
            } else if (isLost) {
                db.collection('user').update({username:pUser.username},  {$inc:{loss:1, rating:-10}});
            } else {
                db.collection('user').update({username:pUser.username},  {$inc:{draw:1, rating:0}});
            }
        }
        
        function caculateAndUpdate() {
            //console.log(' caculateAndUpdate() --  \n Game: %j \n Black: %j \n White %j ', pGame, user_black, user_white);
            console.log(' caculateAndUpdate() --  \n Game: %j  ', pGame);

            if (!pGame.winner) {//Draw
                console.log('  Draw');
                updateUserRateInfo(pGame.black, false, false, true, 0);
                updateUserRateInfo(pGame.white, false, false, true, 0);
                
            } else if (pGame.winner.username === pGame.black.username) {
                console.log('  Black Win');
                updateUserRateInfo(pGame.black, true, false, false, 0);
                updateUserRateInfo(pGame.white, false, true, false, 0);

            } else if (pGame.winner.username === pGame.white.username) {
                console.log('  White Win');
                updateUserRateInfo(pGame.black, false, true, false, 0);
                updateUserRateInfo(pGame.white, true, false, false, 0);
                
            } else {
                console.log('  No one win?')
            }
            
        }
        
        caculateAndUpdate();
        
        //db.collection('user').findOne({username:pGame.black.username}, findBlack);

    });
}

// ------
// Timeout/Remaining time relative methods
// ------

/**
* Call it before the status change, lastActionTime update.
* Ex: Before adding move, change status to [opening, swapping, alt-making, alt-choosing, finished].
*
* return {isBlacksTurn:boolean, basicTimeLeft:int, avaiableTimeLeft:determine timeup or not}
*/
function calculateTimeLeft(pGame) {
    var isBlacksTurn = isBlackTurn(pGame);
    
    var currentActionTime = new Date();
    var tokenTimeThisAction = (currentActionTime - pGame.lastActionTime) / 1000;
    //availableTime unit is secondes
    var basicTimeLeft = (isBlacksTurn ? pGame.blackTimeLeft : pGame.whiteTimeLeft) - tokenTimeThisAction;
//    console.log(' tokenTimeThisAction:%s', tokenTimeThisAction);
    var availableTimeLeft = basicTimeLeft;
    if (basicTimeLeft < 0) {
        if (pGame.timeRule.perMoveTime) {
            availableTimeLeft = basicTimeLeft + pGame.timeRule.perMoveTime;
            //console.log(' tokenTimeThisAction:' + availableTimeLeft);
            basicTimeLeft = 0;
        } 
    } 
//    console.log(' {timeleft:{isBlacksTurn:%s, basicTimeLeft:%s, availableTimeLeft:%s}', isBlacksTurn, basicTimeLeft, availableTimeLeft);
    return {isBlacksTurn:isBlacksTurn, basicTimeLeft:basicTimeLeft, availableTimeLeft:availableTimeLeft};
}

function gameTimeout(pGame, pTiming) {
    pGame.status = 'finished';
    pGame.winner = pTiming.isBlacksTurn ? pGame.white : pGame.black;
    pGame.result = (pTiming.isBlacksTurn ? 'Black' : 'White') + ' time up.';
    if (pTiming.isBlacksTurn) 
        pGame.blackTimeLeft = 0;
    else
        pGame.whiteTimeLeft = 0;

    saveGame(pGame);
}

function gameContinue(pGame, pTiming) {
    if (pTiming.basicTimeLeft <= 0) { 
        if (pTiming.isBlacksTurn)  
            pGame.blackTimeLeft = 0;
        else
            pGame.whiteTimeLeft = 0;
    } else {
        if (pTiming.isBlacksTurn) {
            pGame.blackTimeLeft = pTiming.availableTimeLeft;
            if (pGame.timeRule.perMovePlusTime) pGame.blackTimeLeft += pGame.timeRule.perMovePlusTime;
        } else {
            pGame.whiteTimeLeft = pTiming.availableTimeLeft;
            if (pGame.timeRule.perMovePlusTime) pGame.whiteTimeLeft += pGame.timeRule.perMovePlusTime;
        }
    }
    
    pGame.lastActionTime = new Date();
    pGame.lastActionTime.setTime(pGame.lastActionTime.getTime() + 400);
    pGame.responseTime = new Date();
//    pGame.responseTime.setTime(pGame.responseTime.getTime());
}

function isBlackTurn(pGame) {
    if (pGame.status === 'opening') {
        return true;
    }
        
    if (pGame.status === 'swapping') {
        return true;
    }

    if (pGame.status === 'alt-making') {
        return true;
    }

    if (pGame.status === 'alt-choosing') {
        return true;
    }

    if (pGame.status === 'finished')
        return false;

    if (pGame.moves.length %2 == 0)
        return true;

    return false;
}

module.exports = router;
