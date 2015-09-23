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
        
        io.emit('lobby-user-list', { onlineUsers: m_onlineUsers.listUsers() });
        io.emit('lobby-game-list', { createdGames: m_processingGames.listCreatedGames(), progressingGames: m_processingGames.listProgressingGames()});
    });
    
    socket.on('lobby-create-game', function(data) {
        console.log('On lobby-game-created: ' + util.inspect(data, {showHidden: false, depth:null}));
        
        MongoClient.connect('mongodb://localhost:27017/playfive', function (err, db) {
            if (err) {
                console.log(' Can not connect db.');
                io.emit('message', {message:err.message})
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
                        io.emit('message', {message:err.message})
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
        console.log('On lobby-cancel-game: ' + util.inspect(data, {showHidden: false, depth:null}));
        m_processingGames.removeGame(data.uid);
        io.emit('lobby-game-list', { createdGames: m_processingGames.listCreatedGames(), progressingGames: m_processingGames.listProgressingGames()});
    });
    
    socket.on('lobby-start-game', function(data) {
        console.log('On lobby-start-game: ' + util.inspect(data, {showHidden: false, depth:null}));
        
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
        console.log('On lobby-join-game: ' + util.inspect(data, {showHidden: false, depth:null}));
        var joinGame = m_processingGames.findGame(data.joinGame.uid); 
        socket.join('room_' + joinGame.seq);
        io.emit('game-join', joinGame);
    });
    
    socket.on('lobby-watch-game', function(data) {
        console.log('On lobby-watch-game: ' + util.inspect(data, {showHidden: false, depth:null}));
        
        var watchGame = m_processingGames.findGame(data.watchGame.uid); 
        console.log('Watch-game: ' + util.inspect(watchGame, {showHidden: false, depth:null}));
        
        socket.join('room_' + watchGame.seq);
        
        io.emit('lobby-watched-game', watchGame);
    });
    
    socket.on('lobby-chat', function(message) {
        console.log('On message: ' + util.inspect(message, {showHidden: false, depth:null}));
        io.sockets.emit('lobby-chat-receive', message);
    });
    
    socket.on('game-room-chat-send', function(data) {
        console.log('On game-room-chat-send: ' + util.inspect(data, {showHidden: false, depth:null}));
        //io.to('room_' + data.gameSeq).emit('game-room-chat-receive', data);
        io.sockets["in"]('room_' + data.gameSeq).emit('game-room-chat-receive', data);
    });
    
    socket.on('game-going', function(data) {
        console.log("On going: " + util.inspect(data, {showHidden: false, depth: null}));
        var game = m_processingGames.findGame(data.uid);
        console.log(" Game going: " + util.inspect(game, {showHidden: false, depth: null}));
        
        //Only active game could go next move.
        if (game.status != 'started') {
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
//            console.log(' Send game-going to room -  ' + ('room_' + game.seq));

            io.sockets["in"]('room_' + game.seq).emit('game-going-receive', game.moves);
        }
    });
    
    socket.on('game-drawRequest', function(data) {
        console.log("On drawRequest: " + util.inspect(data, {showHidden: false, depth: null}));
        var me = m_onlineUsers.findUser(data.username);
        var game = m_processingGames.findGame(data.game_id);
        console.log(" Game going: " + util.inspect(game, {showHidden: false, depth: null}));
        var blackUser = m_onlineUsers.findUser(game.black);
        var whiteUser = m_onlineUsers.findUser(game.white);
                
        if (blackUser.username == me.username) {
            gameIo.to(whiteUser.socketId).emit('drawRequest', whiteUser.username);
        } else if (whiteUser.username == me.username) {
            gameIo.to(blackUser.socketId).emit('drawRequest', blackUser.username);
        }
    });
              
    socket.on('game-drawAccept', function(data) {
        console.log("On drawAccept: " + util.inspect(data, {showHidden: false, depth: null}));
        var me = m_onlineUsers.findUser(data.username);
        var game = m_processingGames.findGame(data.game_id);
        console.log(" Game: " + util.inspect(game, {showHidden: false, depth: null}));
        var blackUser = m_onlineUsers.findUser(game.black);
        var whiteUser = m_onlineUsers.findUser(game.white);
        
        game.status = 'finished';
        game.result = 'draw';
                
        if (blackUser) {
            gameIo.to(blackUser.socketId).emit('finished', game);
        } 
        if (whiteUser) {
            gameIo.to(whiteUser.socketId).emit('finished', game);
        }
    });
        
    socket.on('game-drawReject', function(data) {
        console.log("On drawReject: " + util.inspect(data, {showHidden: false, depth: null}));
        var me = m_onlineUsers.findUser(data.username);
        var game = m_processingGames.findGame(move.game_id);
        console.log(" Game: " + util.inspect(game, {showHidden: false, depth: null}));
        var blackUser = m_onlineUsers.findUser(game.black);
        var whiteUser = m_onlineUsers.findUser(game.white);
                
        if (blackUser.username == me.username) {
            gameIo.to(whiteUser.socketId).emit('drawReject', whiteUser.username);
        } else if (whiteUser.username == me.username) {
            gameIo.to(blackUser.socketId).emit('drawReject', blackUser.username);
        }
    });
    
    socket.on('game-resign', function(data) {
        console.log("On resign: " + util.inspect(data, {showHidden: false, depth: null}));
        var me = m_onlineUsers.findUser(data.username);
        var game = m_processingGames.findGame(data.game_id);
        console.log(" Game: " + util.inspect(game, {showHidden: false, depth: null}));
        var blackUser = m_onlineUsers.findUser(game.black);
        var whiteUser = m_onlineUsers.findUser(game.white);
        
        game.winner = (data.username == game.black) ? game.white : game.black;
        game.status = 'finished';
        game.result = data.username + ' resigned.';
                
        if (blackUser) {
            gameIo.to(blackUser.socketId).emit('finished', game);
        } 
        if (whiteUser) {
            gameIo.to(whiteUser.socketId).emit('finished', game);
        }
    });
    
    socket.on('disconnect', function() {
        console.log('On disconnect: where connection socket.id = ' + socket.id);
        console.log(' Online users: ' + util.inspect(m_onlineUsers.listUsers(), {showHidden: false, depth: null}));
        
        var me;
        var onlineUsers = m_onlineUsers.listUsers();
        for (var i in onlineUsers) {
            if (onlineUsers[i].socketId === socket.id) {
                me = onlineUsers[i];
                break;
            }
        }
        
        console.log(" Leave lobby: " + util.inspect(me, {showHidden: false, depth: null}));
        if (me && me.username)
            m_onlineUsers.removeUser(me.username);
        io.sockets.emit('lobby-user-list', { onlineUsers: m_onlineUsers.listUsers() });
    });
});

module.exports = router;
