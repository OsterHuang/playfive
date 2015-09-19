var express = require('express');
var io = require('../my_modules/my-socket.js');
var HashMap = require('hashmap');
//var m_onlineUsers = require('../fivelin/online-users.js');
var router = express.Router();

var onlineUsers = new HashMap();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

io.on('connection', function (socket) {
    
//    socket.on('lobby-user-list', function(data) {
//        socket.broadcast.emit('lobby-user-list', { onlineUsers: m_onlineUsers.listUsers() }); 
//    });
    socket.on('lobby-user-join', function(user) {
        console.log("On lobby-user-join by " + user);
        console.log("%j", onlineUsers.values);
        var alreadyInUser = onlineUsers.get(user.username);
        console.log("Already has user? " + alreadyInUser);
        
        if (!alreadyInUser) {
            var newUser = {
                    username:user.username, 
                    socketId:socket.id,
                    test:'just a test'
                };
            onlineUsers.set(user.username, newUser);
        } else {
            io.sockets.disconnectedMatch(alreadyInUser.socketId);
            alreadyInUser.socketId = socket.id;
        }
        
//        console.log(socket.id);
        //m_onlineUsers.add
        
        io.sockets.emit('lobby-user-list', { onlineUsers: onlineUsers.values });
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
