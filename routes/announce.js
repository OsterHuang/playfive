var express = require('express');
var util = require('util');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/create', function(req, res, next) {
    console.log(" Request data: " + util.inspect(req.body, {showHidden: false, depth: null}));
	
    // -dogswang- admin check
    if(isAdmin(db, req.body.token, res)==false) return;

    // -dogswang- is admin, update
    req.db.collection('counter').findAndModify(
        { _id: 'announce' },
        ['next'],
        { $inc: { next: 1 } },
        { updatedExisting : true }, 
        function(err, doc) {
            console.log('findAndModify:', err, doc);
            db.collection('announce').insertOne({
                number:doc.value.next,
                publisher:req.body.publisher,
                title:req.body.title,
                content:req.body.content,
                isTop:req.body.isTop,
                createdDate: new Date()
            }, function(err, result) {
                if (err) {
                    res.status(500).json({error:err.message});
                    return;
                }

                console.log("公告已新增");
                res.json({
                    messageTitle:'Success',
                    messageContent:'公告已新增。An announcement has been created.'
                });
            });
        }
    );
});

router.post('/edit', function(req, res, next){
    console.log(" Request data: " + util.inspect(req.body, {showHidden: false, depth: null}));
	
        function updateAnnounce() {
            req.body.number *= 1;
            req.db.collection('announce').update(
                {number: req.body.number},
                {$set:{content: req.body.content, title:req.body.title}},
                function(err, result){
                    if(err){
                        res.json({
                            messageTitle:'Error',
                            messageContent:'更新失敗。'
                        });
                        return;
                    }
                    res.json({
                        messageTitle:'Success',
                        messageContent:'更新成功, 請重新整理。'
                    });
                }
            );
        }
        
		// -dogswang- admin check
		isAdmin(db, req.body.token, res, updateAnnounce);
		
		// -dogswang- is admin, update
});

router.post('/getContent', function(req, res, next){
    console.log(" Request data: " + util.inspect(req.body, {showHidden: false, depth: null}));
    
    req.body.number *= 1;
    //需要將轉換為數字，否則搜尋資料庫時可能出現問題

    req.db.collection('announce').findOne(
        {number: req.body.number},

        function(err, doc){
            if(err){
                res.status(500).json({error:err.message});
                return;
            }
            if(!doc){
                console.log('公告不存在');
                res.json({
                    messageTitle:'Sorry',
                    messageContent:'公告['+ req.body.username +']不存在！'
                });
                return;
            }
            res.json({
                title: doc.title,
                content: doc.content,
                createdDate: doc.createdDate,
                publisher: doc.publisher,
                isTop: doc.isTop
            });
        }
    );
});

router.post('/getList', function(req, res){
    req.db.collection('announce').find({},{number:1, title:1, createdDate:1}).sort({createdDate:-1}).toArray( function(err, doc) {
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

router.get('/reset', function(req, res){
    //console.log("Verified parameters:" + req.query.code + " " + req.query.account);
    
    var code = parseInt(req.query.code, 10);
    req.db.collection('user').update({username: req.query.account, verifycode: code}, {$set:{password:code}},function(err, result) {
        // -dogswang- If cannot connect to db
        if (err) {
            console.log('cannot connect to db');
            res.status(500).json({error:err.message});
            return;
        }
        console.log('Query result:' + util.inspect(result, {showHidden:false, depth:null}));
        // -dogswang- If cannot find this data
        if (!result){
            console.log("帳號或密碼錯誤。");
            return;
        }
        console.log()
        res.redirect('reset-done.html#'+code);
    });
});

router.post('/reverify', function(req, res) {
    // -Oster- Should check request parameters....
    console.log(" Request data: " + util.inspect(req.body, {showHidden: false, depth: null}));
		
    if(req.body.username!='')
        restrict = {username: req.body.username};
    else if(req.body.email!='')
        restrict = {email: req.body.email};
    else{
        console.log('no username & email');
        return;
    }

    req.db.collection('user').findOne(
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
            req.db.collection('user').update(
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

router.post('/reset', function(req, res) {
    // -Oster- Should check request parameters....
    console.log(" Request data: " + util.inspect(req.body, {showHidden: false, depth: null}));
		
    if(req.body.username!='')
        restrict = {username: req.body.username};
    else if(req.body.email!='')
        restrict = {email: req.body.email};
    else{
        console.log('no username & email');
        return;
    }

    req.db.collection('user').findOne(
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
            req.db.collection('user').update(
                restrict,
                {$set:{verifycode: randomcode}},
                function(err, result){
                    if(err){
                        res.status(500).json({error:err.message});
                        return;
                    }
                    // -dogswang- 寄送認證信
                    send_reset_code(doc.email, doc.username, randomcode);
                }
            );
        }
    );
});

router.post('/renew', function(req, res) {
    // -Oster- Should check request parameters....
    console.log(" Request data: " + util.inspect(req.body, {showHidden: false, depth: null}));
    
    var restrict = {username:req.body.username, password:req.body.password};
    req.db.collection('user').update(restrict, {$set:{password: req.body.newPsd}}, function(err, result){
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }

    });
});

function isAdmin(db, token, res, updateAnnounce){
	db.collection('user').findOne({
		token: '' + token,
		role: 'admin'
	}, function(err, doc){
        console.log("find one result", doc);
		if(err){
			console.log('unknow error 25963');
			res.json({
				mseeageTitle: 'Error',
				messageContent: 'Unable to connect to db. 25963'
			});
            return;
		}
		if(!doc){
			console.log('you are not admin');
			res.json({
				messageTitle: 'Error',
				messageContent: 'You are not admin'
			});
            return;
		}
		return updateAnnounce();
	});
}

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
	var verifyurl = "http://localhost:3000/account/reset?account="+ username +"&code="+ randomcode;
	server.send({
	   text:    "我們收到您重設密碼的要求，如果您確定要修改您在play5的密碼，\n請點 "+ verifyurl + " ，謝謝。",
	   from:    "you <play5-admin@renju.org.tw>", 
	   to:      address,
	   cc:      "",
	   subject: "play5 請確認是否重設密碼 (Do you really want to reset your password in play5?)"
	}, function(err, message) { console.log(err || message); });
	// -dogswang- End of 寄送確認信
}

module.exports = router;