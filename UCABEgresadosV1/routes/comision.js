var express = require('express');
var app = express();

var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

var conector = require(rootPath +'/connect.js');
var con = conector.conectar();

module.exports = app;