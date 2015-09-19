var express = require('express');
var util = require('util');
var hat = require('hat');
var io = require('../my_modules/my-socket');
var MongoClient = require('mongodb').MongoClient;
var m_onlineUsers = require('../my_modules/online-users');
var m_processingGames = require('../my_modules/processing-games');
var router = express.Router();

module.exports = router;
