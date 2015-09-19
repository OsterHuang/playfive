var express = require('express');
var util = require('util');
var io = require('../fivelin/my-socket.js');
var router = express.Router();

var onlineUsers = {};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

io.on('connection', function (socket) {
    
//    socket.on('lobby-user-list', function(data) {
//        socket.broadcast.emit('lobby-user-list', { onlineUsers: m_onlineUsers.listUsers() }); 
//    });
    socket.on('lobby-user-join', function(user) {
        var username = '' + user.username;
        
        console.log("On lobby-user-join by " + username + " typeof " + typeof username);
        console.log("%j", onlineUsers[username]);
        var alreadyInUser = onlineUsers[username];
        console.log(util.inspect(alreadyInUser, {showHidden: false, depth: null}));
//        console.log("Already has user? " + alreadyInUser + " typeof " + typeof alreadyInUser);
        
        if (!alreadyInUser) {
            var newUser = {
                    username:user.username, 
                    socketId:socket.id,
                    test:'just a test'
                };
            onlineUsers[username] = newUser;
        } else {
            io.sockets.disconnectedMatch(alreadyInUser.socketId);
            alreadyInUser.socketId = socket.id;
        }
        
        console.log(socket.id);
        //m_onlineUsers.add
        
        io.sockets.emit('lobby-user-list', { onlineUsers: listUsers() });
    });
    
    socket.on('lobby-user-invate', function(user) {
        
    });
    
    socket.on('my other event', function (data) {
        console.log(data);
    });

    socket.on('my other event', function (data) {
        console.log(data);
    });
});

var listUsers = function() {
		var theValue = [];
		for(var i in onlineUsers) {
            console.log('idx:' + i + " typeof:" + typeof i);
			theValue.push(onlineUsers[i]);
		}
		return theValue;
	};


//require('../app').io.on('connection', function (socket) {
//  socket.emit('out', { hello: 'This is my day' });
//  socket.on('in', function (data) {
//    console.log(data);
//  });
//});
/* Socket IO
*/
//m_app.io.on('connection', function (socket) {
//  socket.emit('news', { hello: 'world' });
//  socket.on('my other event', function (data) {
//    console.log(data);
//  });
//});

module.exports = router;
