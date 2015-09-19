//Express modules
var express = require('express');


var app = express();

// Socket IO
var server = require('http').Server( app); 
var io = require('socket.io')(server);
server.listen(3030, function(){
  console.log('listening on *:3030');
});


module.exports = io;