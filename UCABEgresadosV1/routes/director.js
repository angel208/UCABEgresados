var express = require('express');
var app = express();

var sess;

var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

var conector = require(rootPath +'/connect.js');
var con = conector.conectar();

module.exports = app;


//++++++++++++++++++  RUTAS  +++++++++++++++++++++++++++++



app.get ( "/aprobacion" , requireLogin, function(req, res){

    sess = req.session;


    if(sess.PeridoAct == null){

        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Aprobación de Postulaciones", mensaje: "Actualmente, no hay ningún período activo."  });

    }
    if(  new Date() < new Date(sess.PeridoAct.FechaIV) && new Date() >= new Date(sess.PeridoAct.FechaFP) ) {

        con.query("SELECT DISTINCT IDCargo, NombreCargo\n" +
                "FROM  cargo, cargosxcarrera, directorescuela\n" +
                "WHERE cargosxcarrera.PeriodoElectoral_IDPE = '"+sess.PeridoAct.IDPE+"' \n" +
                "AND cargosxcarrera.Cargo_IDCargo = cargo.IDCargo\n" +
                "AND cargosxcarrera.Carrera_IDCarrera = directorescuela.IDCarrera\n" +
                "AND directorescuela.IDUsuario = '"+sess.IDUsuario+"'", function (err, result, fields) {


            res.render( "director-preaprobacion", { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList ,lista: result });


        });

    }
    else {
        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Aprobación de Postulaciones", mensaje: "La aprobación de postulaciones no está disponible en este momento"});
    }


});

app.post ( "/aprobacion" , requireLogin, function(req, res) {


    var UpdateQuery = "UPDATE postulacion " +
        "SET  ValidadaEscuela = 0 " +
        "WHERE IDcargo1 = '" + req.body.cargo + "'";


    con.query(UpdateQuery, function (err, result) {
        if (err) throw err;
    });

    if ( req.body.seleccionados){

        var select = req.body.seleccionados;

        UpdateQuery = "UPDATE postulacion " +
            "SET  ValidadaEscuela = 1 WHERE ";

        var i;

        for (i = 0, len = select.length; i < len - 1; i++) {
            UpdateQuery = UpdateQuery + " IDPostulacion = " + select[i] + " OR ";
        }

        UpdateQuery = UpdateQuery + " IDPostulacion = " + select[i];

        con.query(UpdateQuery, function (err, result) {
            if (err) throw err;
        });

    }

    res.redirect("/aprobacion");



});

app.get ( "/aprobacion/:cargo" , requireLogin, function(req, res){


    sess = req.session;


        con.query(  "SELECT Egresado.NombreEgresado, Egresado.ApellidoEgresado, Egresado.CI, cargo.NombreCargo,  cargo.IDCargo , postulacion.IDPostulacion, postulacion.ValidadaEscuela\n" +
                    "FROM  cargo, Egresado, postulacion, directorescuela\n" +
                    "WHERE Egresado.CI = postulacion.CIEgresado\n" +
                    "AND postulacion.IDCargo1 = cargo.IDCargo\n" +
                    "AND cargo.IDCargo = '"+req.params.cargo+"'\n" +
                    "AND postulacion.IDPE1 = '"+sess.PeridoAct.IDPE+"'\n" +
                    "AND Egresado.Carrera_IDCarrera = directorescuela.IDCarrera\n" +
                    "AND directorescuela.IDUsuario = '"+sess.IDUsuario+"' ", function (err, result, fields) {



                res.render( "director-aprobacion", { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList,  lista: result });

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


