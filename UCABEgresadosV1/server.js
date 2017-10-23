var express = require('express');
var app = express();

var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

var bodyParser = require('body-parser');    // pull information from HTML POST (express4)

var comision = require('./routes/comision');
var egresados = require('./routes/egresados');

app.set('view engine', 'ejs')


app.use(express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.use(comision);
app.use(egresados);


app.get('/', function(req, res) {
    res.sendfile('./app/login.html');
});

app.listen(8000);
console.log('listening on 8000....');