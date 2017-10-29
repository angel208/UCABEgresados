var express = require('express');
var app = express();

var sess;

var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

var conector = require(rootPath +'/connect.js');
var con = conector.conectar();

module.exports = app;


//++++++++++++++++++  RUTAS  +++++++++++++++++++++++++++++

app.get('/index2', function(req, res) {

    sess=req.session;
    console.log(sess.SBList);
    res.render('index_egresados', { IDUsuario : sess.IDUsuario, NombreUsu : "Angel", SideBarList : sess.SBList });

});


//++++++++++++++++++  FUNCIONES GLOBALES +++++++++++++++++++++++++++++

function requireLogin (req, res, next) {

    sess = req.session;

    if (!sess.IDUsuario) {
        console.log("no esta logueado");
        res.redirect('/login');
    } else {
        next();
    }
};

