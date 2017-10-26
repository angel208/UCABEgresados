var express = require('express');
var app = express();

var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

var bodyParser = require('body-parser');    // pull information from HTML POST (express4)


var mysql = require('mysql');
var conector = require(__dirname +'/connect.js');
var con = conector.conectar();


var comision = require('./routes/comision');
var egresados = require('./routes/egresados');

app.set('view engine', 'ejs')


app.use(express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded


app.use(comision);
app.use(egresados);


app.get('/', function(req, res) {
    res.redirect('/login');
});

app.get('/login', function(req, res) {
    res.render('login');
});

//cuando se introduce un usuario y una contraseña, esta se verifica
//y dependiendo de el resultado, se devuelve a login (si no existe)
// o se direcciona a la pagina correspondiente al cargo del usuario.
app.post('/login', function(req, res) {

    con.query("SELECT cargo, IDUsuario  FROM usuario WHERE NombreUsu = '"+req.body.user+"' AND ClaveUsu = '"+req.body.pass+"' ", function (err, result, fields) {

        if (err) throw err;

        if ( !result.length ){
            res.redirect("/login");
        }
        else {
            console.log(result[0].cargo);
            res.redirect('/index/'+result[0].IDUsuario);
        }
    });
});


//aca se redirecciona al usuario a su pagina de inicio
app.get('/index/:id', function(req, res) {

    con.query("SELECT cargo FROM usuario WHERE IDUsuario = '"+req.params.id+"' ", function (err, result, fields) {
    console.log(result[0].cargo);

        switch (result[0].cargo.toString()){

            case '1': res.render('index_comision'); break;

            case '3': res.render('index_egresados'); break;

            case '2': res.redirect('/login'); break;

            case '4': res.redirect('/login'); break;

            default: res.redirect('/login'); break;

        }

    });

});


app.listen(8001);
console.log('listening on 8001....');