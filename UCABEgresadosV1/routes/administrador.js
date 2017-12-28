var express = require('express');
var app = express();

var sess;

var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

var conector = require(rootPath +'/connect.js');
var con = conector.conectar();

module.exports = app;


//++++++++++++++++++  RUTAS  +++++++++++++++++++++++++++++



app.get ( "/gestion_usuarios" , requireLogin, function(req, res){

    sess = req.session;


           con.query(" SELECT IDUsuario, NombreUsu, Cargo FROM usuario ORDER BY Cargo, NombreUsu ", function (err, result){

                     res.render( "admin-usuarios", { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList ,usuarios: result });

            });


});

app.post ( "/gestion_usuarios" , requireLogin, function(req, res){

    if ( req.body.SubmitButton == 'delete'){

    }
    //esta cambiando una contraseña
    else{
           var query = "UPDATE usuario SET ClaveUsu = '"+req.body.pass1 + "' WHERE IDUsuario = '" +req.body.Usuario +"'";
           con.query( query , function (err, result){});
    }

    res.redirect("/gestion_usuarios");


});

app.get ( "/gestion_carreras" , requireLogin, function(req, res) {


    sess = req.session;


    con.query("SELECT * FROM Carrera ORDER BY Nombre", function (err, result){

        res.render( "admin-carreras", { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList , carreras: result });

    });



});

app.post ( "/gestion_carreras" , requireLogin, function(req, res){

    if ( req.body.SubmitButton == 'delete'){

        var i = 0 ;
        var seleccionados = req.body.selected;
        var query = "DELETE FROM carrera WHERE "

        for( ; i < (seleccionados.length)-1 ; i++){
            query = query + " IDCarrera = '" + seleccionados[i]  +"' OR "
        }

        query = query + " IDCarrera = '" + seleccionados[i] + "'";

        con.query( query , function (err, result){});

    }
    //esta cambiando una contraseña
    else{

        if ( req.body.Carrera == "nil"){
            var query = "INSERT INTO carrera ( Nombre, Descripcion ) VALUES ( '"+req.body.nombre + "',  '" + req.body.descripcion + "')";
            con.query( query , function (err, result){});
        }
        else{

            var query = "UPDATE carrera SET Nombre = '"+req.body.nombre + "', Descripcion = '" + req.body.descripcion + "' WHERE IDCarrera = '" +req.body.Carrera +"'";
            con.query( query , function (err, result){});

        }


    }

    res.redirect("/gestion_carreras");


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


