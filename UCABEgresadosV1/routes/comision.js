var express = require('express');
var app = express();

var sess;

var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

var conector = require(rootPath +'/connect.js');
var con = conector.conectar();

module.exports = app;


//++++++++++++++++++  RUTAS  +++++++++++++++++++++++++++++

app.get('/historico', function(req, res) {

    con.query("SELECT IDPE FROM periodoelectoral ", function (err, result, fields) {
        sess = req.session;
        if (err) throw err;
        res.render('comision-Consultar-12', { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList, Periodos: result });

    });
});

app.get('/resultados', function(req, res) {

    con.query("SELECT cargo.IDCargo, cargo.NombreCargo,\n" +
        "egresado.NombreEgresado, egresado.ApellidoEgresado, post.Votos\n" +
        "FROM cargo, postulacion as post, egresado\n" +
        "WHERE cargo.IDCargo = post.IDCargo1\n" +
        "AND post.CIEgresado = egresado.CI\n" +
        "AND post.IDPE1 = '"+ req.query.periodo +"'\n" +
        "ORDER BY cargo.NombreCargo, post.votos DESC", function (err, result, fields) {

        sess = req.session;

        res.render( 'comision-Resultados-14.ejs', { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList,
            resultados: result , periodo : req.query.periodo});


    });

});

app.get('/gestionar_periodos', function(req, res) {

        sess = req.session;

        res.render('comision-GestionPeriodo-17.ejs', { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList });


});


app.get('/gestionar_cargos', function(req, res) {


    con.query("SELECT carrera.IDCarrera, carrera.Nombre, cargo.IDCargo, cargo.NombreCargo " +
        "      FROM carrera, cargo, cargosxcarrera " +
        "      WHERE cargosxcarrera.PeriodoElectoral_IDPE = 1 " +
        "      AND Carrera.IDCarrera = cargosxcarrera.Carrera_IDCarrera " +
        "      AND cargosxcarrera.Cargo_IDCargo = cargo.IDCargo " +
        "      ORDER BY cargo.IDCargo ", function (err, result, fields) {

        var cargosxcarrera = result;

        con.query("SELECT DISTINCT carrera.IDCarrera, carrera.Nombre " +
            "      FROM carrera, cargo, cargosxcarrera " +
            "      WHERE cargosxcarrera.PeriodoElectoral_IDPE = 1 " +
            "      AND Carrera.IDCarrera = cargosxcarrera.Carrera_IDCarrera " +
            "      AND cargosxcarrera.Cargo_IDCargo = cargo.IDCargo", function (err, result, fields) {

            var carreras = result;

            con.query("SELECT DISTINCT IDCargo, NombreCargo " +
                "      FROM  cargo ", function (err, result, fields) {

                sess = req.session;

                res.render('comision-GestionCargos-23.ejs', { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList,
                    cargosxcarrera : cargosxcarrera, carreras: carreras, cargos: result});

            });



        });

    });

});

app.post('/gestionar_cargos', function(req, res) {


    if( req.body.updateCargos == 'Eliminar' ){

        var cargos = req.body.cargos_seleccionados;

        console.log('Se han eliminado los siguientes cargos: ');
        var DeleteQuery = "DELETE FROM cargosxcarrera WHERE ";

        var i;

        for ( i=0, len=cargos.length ; i<len-1; i++) {
            DeleteQuery = DeleteQuery + cargos[i] + " OR ";
        }

        DeleteQuery = DeleteQuery + cargos[i];

        console.log( DeleteQuery );
        con.query( DeleteQuery, function (err, result) {

            if (err) throw err;
            console.log ('eliminados');

        });

    }
    else if ( req.body.updateCargos == 'Guardar' ){

        console.log('Cambios Guardados ');

    }
    else if ( req.body.updateCargos == 'AgregarExistente' ) {

        var codigo_cargo = req.body.CargosExistentes.split(" - ");
        codigo_cargo = codigo_cargo[0];

        con.query("INSERT INTO cargosxcarrera (Carrera_IDCarrera, Cargo_IDCargo, PeriodoElectoral_IDPE, Conformado) VALUES ('"+req.body.CarreraDeCargo+"', '"+codigo_cargo+"', '1', '0' )", function (err, result) {

            if (err) throw err;
            console.log ('agregado existente');

        });


    }
    else{

        con.query("INSERT INTO cargo (NombreCargo, descripcion ) VALUES ('"+req.body.NombreNuevoCargo+"', '"+req.body.DescNuevoCargo+"' )", function (err, result) {

            if (err) throw err;
            console.log ('cargo creado');

            con.query("INSERT INTO cargosxcarrera (Carrera_IDCarrera, Cargo_IDCargo, PeriodoElectoral_IDPE, Conformado) VALUES ('"+req.body.Carrera_Cargo+"', '"+result.insertId+"', '1', '0' )", function (err, result) {

                if (err) throw err;
                console.log ('agregado nuevo cargo');

            });

        });



    }
    console.log("redireccionado");
    res.redirect('/gestionar_cargos');

});

app.get( "/totalizacion" , function( req, res ){

    con.query("SELECT IDCarrera, Nombre FROM  carrera ", function (err, result, fields) {

        sess = req.session;

        res.render( "Comision-SeleccionC-11", { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList,
            next_page: '/totalizacion', titulo:"Totalización de Votos Emitidos", subtitulo: "Seleccione la Carrera:", lista: result
        });


    });



});

app.get( "/totalizacion/:carrera" , function( req, res ){

    con.query("SELECT carrera.IDCarrera, cargo.IDCargo, cargo.NombreCargo, carrera.Nombre,\n" +
            "egresado.NombreEgresado, egresado.ApellidoEgresado, post.Fotografia ,post.Votos\n" +
            "FROM carrera, cargo, cargosxcarrera as cxc, postulacion as post, egresado\n" +
            "WHERE carrera.IDCarrera = cxc.Carrera_IDCarrera\n" +
            "AND cxc.Cargo_IDCargo = cargo.IDCargo\n" +
            "AND cargo.IDCargo = post.IDCargo1\n" +
            "AND post.CIEgresado = egresado.CI\n" +
            "AND post.IDPE1 = '1'\n" +
            "AND carrera.IDCarrera = '"+req.params.carrera+"'\n" +
            "ORDER BY cargo.NombreCargo, post.votos  DESC", function (err, result, fields) {

        sess = req.session;

        res.render( "Comision-Totalizacion-21", { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList,
                                                  resultados: result, carrera:result[0].Nombre});


    });



});

app.get ( "/conformacion" , function(req, res){

    con.query("SELECT IDCargo, NombreCargo FROM  cargo ", function (err, result, fields) {

        sess = req.session;

        res.render( "Comision-PreConformacion-26", { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList, lista: result });


    });



});

app.post ( "/conformacion" , function(req, res){

    var select = req.body.seleccionados;

    var UpdateQuery = "UPDATE postulacion " +
                      "SET  ValidadaCE = 0";

    con.query( UpdateQuery, function (err, result) {
        if (err) throw err;
    });

        UpdateQuery = "UPDATE postulacion " +
        "SET  ValidadaCE = 1 WHERE ";

    var i;

    for ( i=0, len=select.length ; i<len-1; i++) {
        UpdateQuery = UpdateQuery + " IDPostulacion = "+ select[i] + " OR ";
    }

    UpdateQuery = UpdateQuery +  " IDPostulacion = " + select[i];

    console.log( UpdateQuery );


    res.redirect("/conformacion");



});

app.get ( "/conformacion/:cargo" , function(req, res){

    con.query("SELECT Egresado.NombreEgresado, Egresado.ApellidoEgresado, Egresado.CI, cargo.NombreCargo,  cargo.IDCargo , postulacion.IDPostulacion\n" +
            "FROM  cargo, Egresado, postulacion\n" +
            "WHERE Egresado.CI = postulacion.CIEgresado\n" +
            "AND postulacion.IDCargo1 = cargo.IDCargo\n" +
            "AND cargo.IDCargo = '"+req.params.cargo+"'\n", function (err, result, fields) {

        sess = req.session;

        res.render( "comision-ConformacionPapeletas-28.ejs", { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList, lista: result });

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

