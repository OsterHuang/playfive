var express = require('express');
var util = require('util');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/createAccount', function(req, res, next) {
    // -Oster- Should check request parameters....
    console.log(" Request data: " + util.inspect(req.body, {showHidden: false, depth: null}));

    // -Oster- Connect to database...
    var url = 'mongodb://localhost:27017/playfive';
    MongoClient.connect(url, function(err, db) {
        // -Oster- If can not connect to database.....
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }
		
		var randomcode = Math.floor(Math.random()*1000000);
        db.collection('user').insertOne({
            username:req.body.username,
            nickname:req.body.nickname,
			password:req.body.password,
			email:req.body.email,
			role:'user',
			status:'temp',
			wrong_password:0,
			rating:1500,
			win:0,
			loss:0,
			draw:0,
			verifycode:randomcode
        }, function(err, result) {
//            assert.equal(err, null); //Log error if error != null
            if (err) {
                res.status(500).json({error:err.message});
                return;
            }

            console.log("新帳號已建立. A new account has been created.");
            res.json({
                messageTitle:'Success',
                messageContent:'Insert one dog successfully'
            });
            
            db.close();
            // -Oster- Maybe redirect to another page on client side, after receive this success message...
			
			// -dogswang- 寄送確認信
			send_verify_code(req.body.email, req.body.username, randomcode);
        });
    });
    // -Oster- This is the our control to send out error message to client.
    // -Oster- Please refer proper http status code on https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
    //res.status(500).json({error:'Your error message'}); 
	
});

router.get('/verify', function(req, res){
    console.log("Verified parameters:" + req.query.code + " " + req.query.account);
	var url = 'mongodb://localhost:27017/playfive';
    MongoClient.connect(url, function(err, db) {
        // -Oster- If can not connect to database.....
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }
		db.collection('user').findOne({"username": req.query.account}, function(err, doc) {
			// -dogswang- If cannot connect to db
			if (err) {
				res.status(500).json({error:err.message});
				res.redirect('verified.html#noaccount');
				return;
			}
			// -dogswang- If cannot find this data
			if (!doc){
				console.log("帳號不存在。");
				res.redirect('verified.html#noaccount2');
				return;
			}
			
			if(doc.verifycode==req.query.code){
				res.redirect('verified.html#verified');
			}
			else{
				var times = doc.wrong_password +1;
				console.log(times);
				if(times<3){
					db.collection('user').update(
						{username: req.query.account},
						{$set:{wrong_password: times}}
					);
					console.log("times = " + times);
					res.redirect('verified.html#notverified');
				}
				else{
					var randomcode = Math.floor(Math.random()*1000000);
					db.collection('user').update(
						{username: req.query.account},
						{$set:{wrong_password: 0, verifycode: randomcode}}
					);
					send_verify_code(doc.email, doc.username, randomcode);
					console.log("認證信重新寄出");
					res.redirect('verified.html#newcode');
				}
			}
			//console.log('Query result:' + util.inspect(doc, {showHidden:false, depth:null}));
		});
	});
/* 
	res.json({
		messageTitle:'Success',
		messageContent:'xxxxx'
	}); */
	
});

router.post('/reverify', function(req, res) {
    // -Oster- Should check request parameters....
    console.log(" Request data: " + util.inspect(req.body, {showHidden: false, depth: null}));

    // -Oster- Connect to database...
    var url = 'mongodb://localhost:27017/playfive';
    MongoClient.connect(url, function(err, db) {
        // -Oster- If can not connect to database.....
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }
		
		if(req.body.username!='')
			restrict = {username: req.body.username};
		else if(req.body.email!='')
			restrict = {email: req.body.email};
		else{
			console.log('no username & email');
			return;
		}

		db.collection('user').findOne(
			restrict,
			function(err, doc){
				// -dogswang- If cannot connect to db
				if (err) {
					res.status(500).json({error:err.message});
					return;
				}
				// -dogswang- If cannot find this data
				if (!doc){
					console.log("帳號或email不存在。");
					return;
				}
				// -dogswang- 更新verifycode
				randomcode = Math.floor(Math.random()*1000000);
				db.collection('user').update(
					restrict,
					{$set:{verifycode: randomcode}},
					function(err, result){
						if(err){
							res.status(500).json({error:err.message});
							return;
						}
						// -dogswang- 寄送認證信
						send_verify_code(doc.email, doc.username, randomcode);
					}
				);
			}
		);
	});
});

router.post('/reset', function(req, res) {
    // -Oster- Should check request parameters....
    console.log(" Request data: " + util.inspect(req.body, {showHidden: false, depth: null}));

    // -Oster- Connect to database...
    var url = 'mongodb://localhost:27017/playfive';
    MongoClient.connect(url, function(err, db) {
        // -Oster- If can not connect to database.....
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }
		
		if(req.body.username!='')
			restrict = {username: req.body.username};
		else if(req.body.email!='')
			restrict = {email: req.body.email};
		else{
			console.log('no username & email');
			return;
		}

		db.collection('user').findOne(
			restrict,
			function(err, doc){
				// -dogswang- If cannot connect to db
				if (err) {
					res.status(500).json({error:err.message});
					return;
				}
				// -dogswang- If cannot find this data
				if (!doc){
					console.log("帳號或email不存在。");
					return;
				}
				// -dogswang- 更新verifycode
				randomcode = Math.floor(Math.random()*1000000);
				db.collection('user').update(
					restrict,
					{$set:{verifycode: randomcode}},
					function(err, result){
						if(err){
							res.status(500).json({error:err.message});
							return;
						}
						// -dogswang- 寄送認證信
						send_verify_code(doc.email, doc.username, randomcode);
					}
				);
			}
		);
	});
});

router.post('/renew', function(req, res) {
    // -Oster- Should check request parameters....
    console.log(" Request data: " + util.inspect(req.body, {showHidden: false, depth: null}));

    // -Oster- Connect to database...
    var url = 'mongodb://localhost:27017/playfive';
    MongoClient.connect(url, function(err, db) {
        // -Oster- If can not connect to database.....
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }
		var restrict = {username:req.body.username, password:req.body.password};
		db.collection('user').update(restrict, {$set:{password: req.body.newPsd}}, function(err, result){
			if (err) {
				res.status(500).json({error:err.message});
				return;
			}
			
		});
	});
});

/*
router.post('/listDog', function(req, res, next) {
    // -Oster- Connect to database...
    var url = 'mongodb://localhost:27017/playfive';
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
            res.status(500).json({error:err.message});
            return;
        } else {
            var collection = db.collection('dog');
            
            collection.find().toArray(function (err, result) {
                if (err) {
                    res.status(500).json({error:err.message});
                    return;
                }
                
                console.log("Inserted one dog successfully.");
                res.json({
                    dogList:result
                });
                
                db.close();
            });
        }
    });
});
*/
module.exports = router;

function send_verify_code(address, username, randomcode){
	// -dogswang- 寄送確認信
	var mailsender   = require("emailjs/email");
	var server  = mailsender.server.connect({
	   user:    "play5-admin@renju.org.tw", 
	   password:"koko0206", 
	   host:    "sp21.g-dns.com", 
	   ssl:     true
	});
	// send the message and get a callback with an error or details of the message that was sent
	var verifyurl = "http://localhost:3000/account/verify?account="+ username +"&code="+ randomcode;
	server.send({
	   text:    "請拜訪 "+ verifyurl + " 啟用您的帳號。",
	   from:    "you <play5-admin@renju.org.tw>", 
	   to:      address,
	   cc:      "",
	   subject: "play5 認證信 (verification mail from play5)"
	}, function(err, message) { console.log(err || message); });
	// -dogswang- End of 寄送確認信
}
