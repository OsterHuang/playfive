var zTool = require('./zTool.js');
var MongoClient = require('mongodb').MongoClient;

var getNextSequence = function (name) {
    MongoClient.connect('mongodb://localhost:27017/playfive', function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:' + err);
        res.status(500).json({error:err.message});
        return; 
    } else {
        var collection = db.collection('user');

        var ret = db.counters.findAndModify(
        {
        query: { _id: name },
        update: { $inc: { seq: 1 } },
        new: true
        }
    );

}

module.exports.getNextSequence = getNextSequence;
