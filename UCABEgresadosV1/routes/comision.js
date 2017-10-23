var express = require('express');
var app = express();

module.exports = app;

app.get('/com', function(req, res) {
    res.send('Hello World!')
});