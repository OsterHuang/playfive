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
    console.log(" Request data: " + util.inspect(req.body, {showHidden: false, depth: null}));

    // -Oster- Connect to database...
    var url = 'mongodb://localhost:27017/playfive';
    MongoClient.connect(url, function(err, db) {
        // -Oster- If can not connect to database.....
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }
		
		var randomcode = genRandomCode();
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
                //res.status(500).json({error:err.message});
                res.status(500).json({error:err.message});
				return;
            }

            console.log("新帳號已建立. A new account has been created.");
            res.json({
                messageTitle:'Success',
                messageContent:'新帳號已建立，請至您申請的email信箱完成認證手續。'
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

router.post('/check_username', function(req, res, next) {
    console.log(" Request data: " + util.inspect(req.body, {showHidden: false, depth: null}));

    // -Oster- Connect to database...
    var url = 'mongodb://localhost:27017/playfive';
    MongoClient.connect(url, function(err, db) {
        // -Oster- If can not connect to database.....
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }
		
		db.collection('user').findOne({
            username:req.body.username
        }, function(err, doc) {
            if (err) {
                res.status(500).json({error:err.message});
				return;
            }
			if(!doc){
				//username doesn't exsit
				console.log('帳號不存在');
				res.json({
					messageTitle:'Success',
					messageContent:'帳號['+ req.body.username +']可使用！This username is availible.'
				});
				return;
			}

			//username exsits
            console.log("username exsits");
            res.json({
                messageTitle:'Sorry',
                messageContent:'['+ req.body.username + ']已被使用。This username has been taken.'
            });
            
            db.close();
        });
    });
});

router.post('/check_nickname', function(req, res, next) {
    console.log(" Request data: " + util.inspect(req.body, {showHidden: false, depth: null}));

    // -Oster- Connect to database...
    var url = 'mongodb://localhost:27017/playfive';
    MongoClient.connect(url, function(err, db) {
        // -Oster- If can not connect to database.....
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }
		
		db.collection('user').findOne({
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
					messageTitle:'Success',
					messageContent:'暱稱['+ req.body.nickname +']可使用！This nickname is availible.'
				});
				return;
			}

			//username exsits
            console.log("username exsits");
            res.json({
                messageTitle:'Sorry',
                messageContent:'['+ req.body.nickname + ']已被使用。This nickname has been taken.'
            });
            
            db.close();
        });
    });
});

router.post('/check_email', function(req, res, next) {
    console.log(" Request data: " + util.inspect(req.body, {showHidden: false, depth: null}));
    // -Oster- Connect to database...
    var url = 'mongodb://localhost:27017/playfive';
    MongoClient.connect(url, function(err, db) {
        // -Oster- If can not connect to database.....
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }
		
		db.collection('user').findOne({
            email:req.body.email
        }, function(err, doc) {
            if (err) {
             	res.status(500).json({error:err.message});
				return;
            }
			if(!doc){
				//email doesn't exsit
				console.log('email does not exsit');
				res.json({
					messageTitle:'Success',
					messageContent:'暱稱['+ req.body.email +']可使用！This email is availible.'
				});
				return;
			}

			//email exsits
            console.log("username exsits");
            res.json({
                messageTitle:'Sorry',
                messageContent:'['+ req.body.email + ']已被使用。This email has been taken.'
            });
            
            db.close();
        });
    });
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
				db.collection('user').update(
					{username: req.query.account},
					{$set:{status: 'normal'}}
				);
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
					var randomcode = genRandomCode();
					db.collection('user').update(
						{username: req.query.account},
						{$set:{wrong_password: 0, verifycode: randomcode}}
					);
					send_verify_code(doc.email, doc.username, randomcode);
					console.log("認證信重新寄出");
					res.redirect('verified.html#newcode');
				}
			}
		});
	});
});

router.get('/reset', function(req, res){
    //console.log("Verified parameters:" + req.query.code + " " + req.query.account);
	var url = 'mongodb://localhost:27017/playfive';
    MongoClient.connect(url, function(err, db) {
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }
		//var code = parseInt(req.query.code, 10);
		var code = req.query.code;
		db.collection('user').update({username: req.query.account, verifycode: code}, {$set:{password:code}},function(err, result) {
			// -dogswang- If cannot connect to db
			if (err) {
				console.log('cannot connect to db');
				res.status(500).json({error:err.message});
				return;
			}
			console.log('Query result:' + util.inspect(result, {showHidden:false, depth:null}));
			// -dogswang- If cannot find this data
			if (result.result.nModified==0){
				console.log("重設失敗。19263");
				res.redirect('reset-fail.html');
			}
			else if(result.result.nModified==1){
				console.log("重設成功。19264");
				console.log('code is:', code);
				code = 'reset-done.html#'+code;
				console.log('code is:', code);
				res.redirect(code);
				return;
			}
			else{
				console.log("不明錯誤。19265");
			}
		});
	});
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
		
		if(typeof req.body.username!="undefined")
			restrict = {username: req.body.username};
		else if(typeof req.body.email != "undefined")
			restrict = {email: req.body.email};
		else{
			console.log('no username & email');
			return;
		}
		console.log('restrict is:', restrict);
		
		
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
				randomcode = genRandomCode();
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
						res.json({
							messageTitle: 'Success',
							messageContent: '請收取email以完成認證手續。Please check your E-mail.'
						});
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
		
		if(typeof req.body.username != 'undefined')
			restrict = {username: req.body.username};
		else if(typeof req.body.email != 'undefined')
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
				randomcode = genRandomCode();
				db.collection('user').update(
					restrict,
					{$set:{verifycode: randomcode}},
					function(err, result){
						if(err){
							res.status(500).json({error:err.message});
							return;
						}
						// -dogswang- 寄送認證信
						send_reset_code(doc.email, doc.username, randomcode);
						res.json({
							messageTitle: 'Success',
							messageContent: '請收取email以完成修改手續。Please check your E-mail.'
						});
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
				res.json({
					messageTitle: 'Error',
					messageContent: err.message
				});
				return;
			}

			//console.log('result is:', result);
			if(result.result.nModified==1){
				res.json({
					messageTitle: 'Success',
					messageContent: '密碼已更新。Password has been renewed.'
				});
			}
			else if(result.result.nModified==0){
				res.json({
					messageTitle: 'Error',
					messageContent: '帳號或密碼錯誤。Wrong account or password.'
				});
			}
			else{
				res.json({
					messageTitle: 'Error',
					messageContent: 'Error 1276.'
				});
			}
		});
	});
});
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
	var verifyurl = "http://128.199.91.60:3000/account/verify?account="+ username +"&code="+ randomcode;
	var mailContent = 
		"請拜訪 " + verifyurl 
		+ " 啟用您的帳號。Please visit " 
		+ verifyurl + " to activate your account."
	;
	server.send({
	   text:    mailContent,
	   from:    "admin@play5 <play5-admin@renju.org.tw>", 
	   to:      address,
	   cc:      "",
	   subject: "play5 認證信 (verification mail from play5)"
	}, function(err, message) { console.log(err || message); });
	// -dogswang- End of 寄送確認信
}
function send_reset_code(address, username, randomcode){
	// -dogswang- 寄送確認信
	var mailsender   = require("emailjs/email");
	var server  = mailsender.server.connect({
	   user:    "play5-admin@renju.org.tw", 
	   password:"koko0206", 
	   host:    "sp21.g-dns.com", 
	   ssl:     true
	});
	// send the message and get a callback with an error or details of the message that was sent
	var verifyurl = "http://128.199.91.60:3000/account/reset?account="+ username +"&code="+ randomcode;
	var mailContent = 
		"我們收到您重設"+ username +"之密碼的要求，如果您確定要修改您在play5的密碼，請點 "+ verifyurl + " ，謝謝。"
		+ "We receive an request to reset your password in Play5. If you really want to reset your password, please visit "
		+ verifyurl + " . If not, please ignore this mail, thanks."
	;
	server.send({
	   text:    mailContent,
	   from:    "admin@play5 <play5-admin@renju.org.tw>", 
	   to:      address,
	   cc:      "",
	   subject: "play5 請確認是否重設密碼 (Do you really want to reset your password in play5?)"
	}, function(err, message) { console.log(err || message); });
	// -dogswang- End of 寄送確認信
}

function genRandomCode(){
	return Math.floor(Math.random()*1000000).toString();
}