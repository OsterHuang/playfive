var express = require('express');

var util = require('util');
var io = require('../my_modules/my-socket');
var MongoClient = require('mongodb').MongoClient;

var m_onlineUsers = require('../my_modules/online-users');
var m_processingGames = require('../my_modules/processing-games');

var router = express.Router();

router.post('/latest-games', function(req, res, next) {
    console.log(req.body);
    
    //Check user name field
    if (!req.body.token) {
        res.status(401).json({
            result:'error',
            message:'Unauthorized'
        });
        
        return;
    }
    
    MongoClient.connect('mongodb://localhost:27017/playfive', function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:' + err);
            res.status(500).json({error:err.message});
            return; 
        } else {
            var collection = db.collection('game');
            
            collection.find(
                    {$or:[{"black.username":req.body.username}, {"white.username":req.body.username}]}, 
//                    {_id:0})
//                .sort({seq:-1})
                    { sort: { seq:-1 }, fields : { _id:0}, limit : 10})
                .toArray(function(err, docs) {
                    if (err) {
                        console.log(err);
                        res.status(500).json({error:err.message});
                        return;
                    }

//                    console.log('Found docs:' + util.inspect(docs, {showHidden: false, depth: null}));
                    
                    res.status(200).json({
                        result:'success',
                        userLatestGames:docs
                    });

                    db.close();
            });
        }
    });    
});


module.exports = router;
