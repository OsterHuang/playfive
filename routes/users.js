var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var crypto = require('crypto');
var util = require('util');

var router = express.Router();

var m_onlineUsers = require('../my_modules/online-users.js');

router.post('/login', function(req, res, next) {
    console.log(req.body);
    
    //Check user name field
    if (!req.body.username || !req.body.username.trim()) {
        res.status(200).json({
            result:'error',
            message:'username is empty.'
        });
        
        return;
    }
    if (!req.body.password || !req.body.password.trim()) {
        res.status(200).json({
            result:'error',
            message:'Password is empty.'
        });
        
        return;
    }
    
    
    var collection = req.db.collection('user');

    collection.findOne({username: req.body.username, password:req.body.password}, function(err, document) {
        if (err) {
            console.log(err);
            res.status(500).json({error:err.message});
            return;
        }

        console.log('Found document:' + util.inspect(document, {showHidden: false, depth: null}));
        if (document) {
            if(!document.status || document.status === 'temp') {
                console.log('Status temp.' + req.body.username);
                res.status(200).json({
                    result:'fail',
                    message:'You account is not verified.',
                });
                return;
            }
            if(document.status === 'banned') {
                console.log('Status banned.' + req.body.username);
                res.status(200).json({
                    result:'fail',
                    message:'You account is banned.',
                });
                return;
            }
            
            if (!(document.status === 'normal' || document.status === 'silent')) {
                 res.status(200).json({
                    result:'fail',
                    message:'Account problem.',
                });
                return;
            }
            
            //Generate token
            var token = crypto.randomBytes(16).toString('hex');
            console.log('Generated token:' + token);

            //Check user login already or not

            //Update token
            collection.updateOne(
                {_id:document._id}, 
                {
                    $set: { token: token },
                    $currentDate: { lastModified: true }
                }, 
                function(err, results) {
                    if (err) {
                        console.log('Update token error:' + err);
                        res.status(500).json({error:err.message});
                        return; 

                    } else {
                        if(typeof document.language == 'undefined')
							document.language = 'English';
						res.status(200).json({
                            result:'success',
                            message:'Login success.',
                            token:token,
							language:document.language
                        });

                        console.log('language is:', document.language);
						console.log(results);
                    }
                }
            );
        } else {
            res.status(200).json({
                result:'fail',
                message:'username or password error',
            });
        }
    });
    
});

router.post('/me', function(req, res, next) {
    console.log(req.body);
    
    //Check user name field
    if (!req.body.token) {
        res.status(400).json({
            result:'error',
            message:'Parameter error.'
        });
        
        return;
    }
    
    var collection = req.db.collection('user');

    collection.findOne({token:req.body.token}, function(err, document) {
        if (err) {
            console.log(err);
            res.status(500).json({error:err.message});
            return;
        }

        console.log('Found document:' + util.inspect(document, {showHidden: false, depth: null}));
        if (document) {

            //Check user login already or not
            res.status(200).json({
                result:'success',
                user:{
                    username:document.username,
                    nickname:document.nickname,
                    role:document.role,
                    status:document.status,
                    rating:document.rating
                }
            });
        } else {
            res.status(200).json({
                result:'fail',
                message:'Unauthoried',
            });
        }
    });
});

router.post('/user-info', function(req, res, next) {
    console.log(req.body);
    
    //Check user name field
    if (!req.body.token) {
        res.status(401).json({
            result:'error',
            message:'Unauthorized'
        });
        
        return;
    }
    
    var collection = req.db.collection('user');

    collection.findOne({username:req.body.username}, ['username', 'nickname', 'email', 'rating', 'win', 'loss', 'draw'], function(err, document) {
        if (err) {
            console.log(err);
            res.status(500).json({error:err.message});
            return;
        }

        console.log('Found document:' + util.inspect(document, {showHidden: false, depth: null}));
        if (document) {

            //Check user login already or not
            res.status(200).json({
                result:'success',
                userInfo:document
            });
        } else {
            res.status(200).json({
                result:'fail',
                message:'No such member',
            });
        }
    });
});

router.post('/logout', function(req, res, next) {
    console.log(req.body);
    
    //Check user name field
    if (!req.body.username || !req.body.username.trim()) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(
            {
                result:'error',
                message:'No one will logout'
            }
        ));
        res.end();
        
        return;
    }
    
    //Check user login already or not
    console.log('Check user exists');
    var existsUser = m_onlineUsers.findUsers(req.body.username);
    if (existsUser) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(
            {
                result:'error',
                message:'The user is not online'
            }
        ));
        res.end();
        
        return;
    }
    
    //Do login
    console.log('Add user to lobby');

    m_onlineUsers.removeUser(
        {
            username:req.body.username
        }
    );
    console.log(m_onlineUsers.listUsers());
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(
        {
            result:'success',
            message:'Logout success'
        }
    ));
    res.end();
    
});

module.exports = router;
