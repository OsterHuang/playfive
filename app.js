//Express modules
var express = require('express');
var expressMongoDb = require('express-mongo-db');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Our modules
var routes = require('./routes/index');
var account = require('./routes/account');
var announce = require('./routes/announce');
var admin = require('./routes/admin');
var users = require('./routes/users');
var main = require('./routes/main');
var lobby = require('./routes/lobby');
var game = require('./routes/game');

var app = express();

// view engine setup
//app.set("view options", {layout: false});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressMongoDb('mongodb://localhost:27017/playfive'));

app.use('/', routes);
app.use('/account', account);
app.use('/announce', announce);
app.use('/admin', admin);
app.use('/users', users);
app.use('/lobby', lobby);
app.use('/main', main);
app.use('/game', game);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  .json({
    message: err.message,
    error: {}
  });
});


module.exports = app;