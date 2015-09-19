var express = require('express');
var util = require('util');
var hat = require('hat');
var io = require('../my_modules/my-socket');
var m_onlineUsers = require('../my_modules/online-users');
var m_processingGames = require('../my_modules/processing-games');
var router = express.Router();

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
        
        var newGame = {
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
        
        io.emit('lobby-game-list', { createdGames: m_processingGames.listCreatedGames(), progressingGames: m_processingGames.listProgressingGames()});
    });
    
    socket.on('lobby-cancel-game', function(data) {
        console.log('On lobby-cancel-game: ' + util.inspect(data, {showHidden: false, depth:null}));
        m_processingGames.removeGame(data.uid);
        io.emit('lobby-game-list', { createdGames: m_processingGames.listCreatedGames(), progressingGames: m_processingGames.listProgressingGames()});
    });
    
    socket.on('lobby-join-game', function(data) {
        console.log('On lobby-join-game: ' + util.inspect(data, {showHidden: false, depth:null}));
        
        var joinGame = m_processingGames.findGame(data.joinGame.uid); console.log('Join-game: ' + util.inspect(joinGame, {showHidden: false, depth:null}));
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
    
    socket.on('message', function(message) {
        console.log('On message: ' + util.inspect(message, {showHidden: false, depth:null}));
        io.sockets.emit('message', message);
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
