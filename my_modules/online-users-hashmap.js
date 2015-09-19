var HashMap = require('hashmap');

//Use map to stroe on-line users
var onlineUsers = new HashMap();

var findUser = function(username) {
    console.log('findUser() %s', username);
    return onlineUsers.get(username);
}

var listUsers = function() {
    console.log('listUsers keys ' + onlineUsers.keys());
    return onlineUsers.values();
}

var addUser = function(user) {
//    console.log('addUser() %j', user);
//    console.log("Add User:" + onlineUsers.put(user.username, user));
    onlineUsers.set(user.username, user);
}

var removeUser = function(username) {
    onlineUsers.remove(username);
}

module.exports.findUser = findUser;
module.exports.listUsers = listUsers;
module.exports.addUser = addUser;
module.exports.removeUser = removeUser;
