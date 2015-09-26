var express = require('express');
var util = require('util');
var hat = require('hat');
var io = require('../my_modules/my-socket');
var MongoClient = require('mongodb').MongoClient;
var m_onlineUsers = require('../my_modules/online-users');
var m_processingGames = require('../my_modules/processing-games');
var router = express.Router();

console.log('Insert one game counter...');
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
        if (joinGame.isTempBlack) {
            joinGame.tempBlack = {nickname:creator.nickname, username:creator.username};
            joinGame.black = {nickname:creator.nickname, username:creator.username};
            joinGame.white = {nickname:participant.nickname, username:participant.username};
        } else {
            joinGame.tempBlack = {nickname:participant.nickname, username:participant.username};
            joinGame.black = {nickname:participant.nickname, username:participant.username};
            joinGame.white = {nickname:creator.nickname, username:creator.username};
        }
        joinGame.status = "started";
        
        io.emit('lobby-game-list', { createdGames: m_processingGames.listCreatedGames(), progressingGames: m_processingGames.listProgressingGames()});
    });
    
    socket.on('lobby-join-game', function(data) {
        console.log("On lobby-join-game: (" + socket.username + ", " + socket.room + ")", data);
        var joinGame = m_processingGames.findGame(data.joinGame.uid); 
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
        
        game.moves.push({
            seq: data.seq,
            ordinate: data.ordinate
        });
        
        if (m_processingGames.win(game.boardSize, game.moves)) {
            game.status = 'finished';
            game.winner = game.moves.length % 2 == 1 ? game.black : game.white;
            game.result = game.moves.length % 2 == 1 ? 'Black wins' : 'White win';
            io.sockets["in"]('room_' + game.seq).emit('game-finished', game);
        } else {
            io.sockets["in"]('room_' + game.seq).emit('game-going-receive', game.moves);
        }
    });
    
    socket.on('game-undo', function(data) {
        console.log("On undo: (" + socket.username + ", " + socket.room + ")", data);
        var game = m_processingGames.findGame(data.game_id);
        console.log(" Game undo: " + util.inspect(game, {showHidden: false, depth: null}));
        
        //Only active game could go next move.
        if (game.status != 'started') {
            return;
        }
        if (game.black.username != socket.username && game.white.username != socket.username) {
            console.log(' Not the user game.');
            socket.emit('message', {message:'This is not your game.'});
            return;
        }
        
        var undoMove = game.moves.pop();
        
        io.sockets["in"]('room_' + game.seq).emit('game-undo-receive', undoMove);
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
        
        game.winner = (data.username == game.black) ? game.white.nickname : game.black.nickname;
        game.status = 'finished';
        game.result = data.username + ' resigned.';
                
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
});

module.exports = router;
