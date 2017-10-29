var express = require('express');
var app = express();

var sess;

var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

var conector = require(rootPath +'/connect.js');
var con = conector.conectar();

module.exports = app;


//++++++++++++++++++  RUTAS +++++++++++++++++++++++++++++


app.get('/candidatos-egre/:IDCargo', requireLogin, function(req, res) {

    con.query("SELECT NombreCargo FROM cargo WHERE IDCargo ='"+req.params.IDCargo+"'", function (err, result, fields) {
        sess = req.session;
        var NombreCargo;
        console.log(result[0].NombreCargo);
        NombreCargo = result[0].NombreCargo;

        res.render('egresado-listaCandidato',{nombreCargo:NombreCargo,SideBarList:sess.SBList, IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario});
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
