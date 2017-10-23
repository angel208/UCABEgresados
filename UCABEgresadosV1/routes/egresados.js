var express = require('express');
var app = express();

module.exports = app;

app.get('/eg', function(req, res) {
    res.send('Hello World!')
});