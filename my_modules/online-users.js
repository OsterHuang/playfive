var zTool = require('./zTool.js');

//Use map to stroe on-line users
var onlineUsers = new zTool.SimpleMap();

var findUser = function(username) {
//    console.log('findUser() %s', username);
    return onlineUsers.get(username);
}

var listUsers = function() {
    return onlineUsers.values();
}

var addUser = function(user) {
//    console.log('addUser() %j', user);
    console.log("Add User:" + onlineUsers.put(user.username, user));
}

var removeUser = function(username) {
    onlineUsers.remove(username);
}

module.exports.findUser = findUser;
module.exports.listUsers = listUsers;
module.exports.addUser = addUser;
module.exports.removeUser = removeUser;
