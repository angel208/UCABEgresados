var express = require('express');
var app = express();

var sess;

var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

var conector = require(rootPath +'/connect.js');
var con = conector.conectar();

module.exports = app;


//++++++++++++++++++  RUTAS  +++++++++++++++++++++++++++++

app.get('/candidatos-comision/:carrera', function(req, res) {

    con.query("SELECT Nombre  FROM carrera WHERE IDCarrera = '"+req.params.carrera+"' ", function (err, result, fields) {
        sess = req.session;
        if (err) throw err;
        res.render('egresados-CandidatoCU-5', { IDUsuario : sess.IDUsuario, NombreUsu : "Angel", SideBarList : sess.SBList, Nombre: result[0].Nombre });

    });


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

