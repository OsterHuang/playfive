var express = require('express');
var util = require('util');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/check_nickname', function(req, res, next) {
    console.log(" Request data: " + util.inspect(req.body, {showHidden: false, depth: null}));

    req.db.collection('user').findOne({
        nickname:req.body.nickname
    }, function(err, doc) {
        if (err) {
            //res.status(500).json({error:err.message});
            res.status(500).json({error:err.message});
            return;
        }
        if(!doc){
            //nickname doesn't exsit
            console.log('nickname does not exsit');
            res.json({
                messageTitle:'Sorry',
                messageContent:'暱稱['+ req.body.nickname +']不存在！Nickname does not exist.'
            });
            return;
        }

        //nickname exsits
        console.log("nickname exsits");
        res.json({
            messageTitle:'Success',
            messageContent:'['+ req.body.nickname + ']存在。Nickname exists.'
        });
    });
});

router.post('/login', function(req, res){
	var isRoot = check_root(req.body.password);
	if(isRoot==false) return;
	
    req.db.collection('user').find({role: 'admin'},{nickname:1}).sort({nickname:1}).toArray( function(err, doc) {
        // -dogswang- If cannot connect to db
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }
        // -dogswang- If cannot find this data
        if (!doc){
            console.log("資料庫不存在。");
            return;
        }
        res.json(doc);
    });
});

router.post('/add', function(req, res){
	var isRoot = check_root(req.body.password);
	if(isRoot==false) return;
    
    req.db.collection('user').updateOne(
        {nickname: req.body.nickname},
        {$set: {role: 'admin'}},
        function(err, result) {
            if(err){
                console.log('unable to connect to db.');
                return;
            }
            if(result.result.nModified==1){
                console.log('new admin has been added.');
                //-dogswang- if success to modify
			    req.db.collection('user').find({role: 'admin'},{nickname:1}).sort({nickname:1}).toArray( function(err, doc) {
					// -dogswang- If cannot connect to db
					if (err) {
						res.status(500).json({error:err.message});
						return;
					}
					// -dogswang- If cannot find this data
					if (!doc){
						console.log("資料庫不存在。");
						return;
					}
					res.json({
						adminList: doc,
						messageTitle: 'Success',
						messageContent: '管理員新增成功'
					});
				});
            }
            console.log('unknow error 24175');
        }
    );

});

router.post('/del', function(req, res){
	var isRoot = check_root(req.body.password);
	if(isRoot==false) return;
    
    req.db.collection('user').updateOne(
        {nickname: req.body.nickname},
        {$set: {role: 'user'}},
        function(err, result) {
            if(err){
                console.log('unable to connect to db.');
                hasModified = false;
                return;
            }
            if(result.result.nModified==1){
                console.log('new admin has been deleted.');
                hasModified = true;
            
				req.db.collection('user').find({role: 'admin'},{nickname:1}).sort({nickname:1}).toArray( function(err, doc) {
					// -dogswang- If cannot connect to db
					if (err) {
						console.log('Error 16583');
						res.status(500).json({error:err.message});
						return;
					}
					// -dogswang- If cannot find this data
					if (!doc){
						console.log('Error 16584');
						console.log("資料庫不存在。");
						return;
					}
					if(hasModified==true){
						res.json({
							adminList: doc,
							messageTitle: 'Success',
							messageContent: '管理員刪除成功'
						});
					}
					else{
						res.json({
							adminList: doc,
							messageTitle: 'Error',
							messageContent: '管理員刪除失敗'
						});
					}
				});
			}
            console.log('unknow error 24175');
            hasModified = false;
		}
	);
	
});

module.exports = router;
function check_root(psd){
	if(psd == 'riftwisthebest') return true;
	return false;
}