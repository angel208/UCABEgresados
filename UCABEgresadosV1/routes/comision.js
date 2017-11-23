var express = require('express');
var app = express();

var sess;

var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

var conector = require(rootPath +'/connect.js');
var con = conector.conectar();

var xlsmaker = require(rootPath +'/excelGen.js');

var dateFormat = require('dateformat');

module.exports = app;


//++++++++++++++++++  RUTAS  +++++++++++++++++++++++++++++

app.get('/historico', requireLogin, function(req, res) {

    con.query("SELECT IDPE FROM periodoelectoral ", function (err, result, fields) {
        sess = req.session;
        if (err) throw err;
        res.render('comision-Consultar-12', { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList, cargo : sess.cargo ,Periodos: result });

    });
});

app.get('/resultados', requireLogin, function(req, res) {

    con.query("SELECT cargo.IDCargo, cargo.NombreCargo,\n" +
        "egresado.NombreEgresado, egresado.ApellidoEgresado, post.Votos\n" +
        "FROM cargo, postulacion as post, egresado\n" +
        "WHERE cargo.IDCargo = post.IDCargo1\n" +
        "AND post.CIEgresado = egresado.CI\n" +
        "AND post.IDPE1 = '"+ req.query.periodo +"'\n" +
        "ORDER BY cargo.NombreCargo, post.votos DESC", function (err, result, fields) {

        sess = req.session;

        res.render( 'comision-Resultados-14.ejs', { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList,
            cargo : sess.cargo ,resultados: result , periodo : req.query.periodo});


    });

});

app.get('/gestionar_periodos', requireLogin, function(req, res) {

    con.query("SELECT *  FROM  periodoelectoral ORDER BY Estado", function (err, result, fields) {

        sess = req.session;

        result[0].FechaInicio=  dateFormat(result[0].FechaInicio, "dd/mm/yyyy");
        result[0].FechaFin=  dateFormat(result[0].FechaFin, "dd/mm/yyyy");
        result[0].FechaIP=  dateFormat( result[0].FechaIP, "dd/mm/yyyy");
        result[0].FechaFP=  dateFormat(result[0].FechaFP, "dd/mm/yyyy");
        result[0].FechaIV=  dateFormat(result[0].FechaIV, "dd/mm/yyyy");
        result[0].FechaFV=  dateFormat(result[0].FechaFV, "dd/mm/yyyy");

        var NombreEstado;

        switch ( result[0].Estado ){
            case 'I': NombreEstado = 'Vigente'; break;
            case 'P': NombreEstado = 'Postulaciones en Proceso'; break;
            case 'V': NombreEstado = 'Votaciones en Proceso'; break;
            default : NombreEstado = 'Culminado';
        }

        res.render('comision-GestionPeriodo-17.ejs', { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList, periodos : result, NombreEstado: NombreEstado });

    });


});

app.post('/gestionar_periodos', requireLogin, function(req, res) {



    if (req.body.submit == 'guardar') {

        var post = req.body;

        var query = "INSERT INTO periodoelectoral (IDPE, FechaInicio, FechaFin, FechaIP, FechaFP, FechaIV, FechaFV, Estado)" +
             " VALUES ('"+post.idperiodo+"', STR_TO_DATE('"+post.FI+"','%d/%m/%Y')"+", STR_TO_DATE('"+post.FF+"','%d/%m/%Y')"+
             ", STR_TO_DATE('"+post.FIP+"','%d/%m/%Y')"+", STR_TO_DATE('"+post.FFP+"','%d/%m/%Y')"+
             ", STR_TO_DATE('"+post.FIV+"','%d/%m/%Y')"+", STR_TO_DATE('"+post.FFV+"','%d/%m/%Y')"+", 'I') " +
             "  ON DUPLICATE KEY UPDATE FechaInicio=VALUES(FechaInicio), FechaFin=VALUES(FechaFin),  FechaIP=VALUES( FechaIP ), " +
            "                           FechaFP=VALUES(FechaFP), FechaIV=VALUES(FechaIV), FechaFV=VALUES(FechaFV)";

        con.query( query, function (err, result) {

            if (err) throw err;

            res.redirect("/gestionar_periodos");

        });



    }
    else if (req.body.submit == 'eliminar'){

        var post = req.body;

        con.query("DELETE FROM periodoelectoral WHERE  IDPE = '"+post.idperiodo+"' AND Estado = 'I'", function (err, result) {

            if (err) throw err;

            res.redirect("/gestionar_periodos");

        });

    }
    else {
        con.query("SELECT *  FROM  periodoelectoral WHERE IDPE = " + req.body.periodo + " ", function (err, result, fields) {


            result[0].FechaInicio = dateFormat(result[0].FechaInicio, "dd/mm/yyyy");
            result[0].FechaFin = dateFormat(result[0].FechaFin, "dd/mm/yyyy");
            result[0].FechaIP = dateFormat(result[0].FechaIP, "dd/mm/yyyy");
            result[0].FechaFP = dateFormat(result[0].FechaFP, "dd/mm/yyyy");
            result[0].FechaIV = dateFormat(result[0].FechaIV, "dd/mm/yyyy");
            result[0].FechaFV = dateFormat(result[0].FechaFV, "dd/mm/yyyy");

            console.log(result[0]);

            res.send(result[0]);
        });
    }

});

app.get('/gestionar_cargos', requireLogin, function(req, res) {

    sess = req.session;

    if(sess.PeridoAct == null){

        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Gestionar Cargos por Carreras", mensaje: "Actualmente, no hay ningún período activo."  });

    }
    if(  new Date() < new Date(sess.PeridoAct.FechaIP)  ) {

        sess = req.session;

        con.query("SELECT carrera.IDCarrera, carrera.Nombre, cargo.IDCargo, cargo.NombreCargo " +
            "      FROM carrera, cargo, cargosxcarrera " +
            "      WHERE cargosxcarrera.PeriodoElectoral_IDPE = '"+sess.PeridoAct.IDPE+"' " +
            "      AND Carrera.IDCarrera = cargosxcarrera.Carrera_IDCarrera " +
            "      AND cargosxcarrera.Cargo_IDCargo = cargo.IDCargo " +
            "      ORDER BY cargo.IDCargo ", function (err, result, fields) {

            var cargosxcarrera = result;

            con.query("SELECT DISTINCT carrera.IDCarrera, carrera.Nombre " +
                "      FROM carrera, cargo, cargosxcarrera " +
                "      WHERE cargosxcarrera.PeriodoElectoral_IDPE = '"+sess.PeridoAct.IDPE+"' " +
                "      AND Carrera.IDCarrera = cargosxcarrera.Carrera_IDCarrera " +
                "      AND cargosxcarrera.Cargo_IDCargo = cargo.IDCargo", function (err, result, fields) {

                var carreras = result;

                con.query("SELECT DISTINCT IDCargo, NombreCargo " +
                    "      FROM  cargo ", function (err, result, fields) {


                    res.render('comision-GestionCargos-23.ejs', {
                        IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList,
                        cargosxcarrera: cargosxcarrera, carreras: carreras, cargos: result
                    });
                });
            });
        });

    }
    else {
        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
                                        titulo: "Gestionar Cargos por Carreras", mensaje: "La fecha límite para la gestión de cargos ha culminado."  });
    }
});

app.post('/gestionar_cargos', requireLogin, function(req, res) {


    if( req.body.updateCargos == 'Eliminar' ){

        if ( req.body.cargos_seleccionados) {
            var cargos = req.body.cargos_seleccionados;

            console.log('Se han eliminado los siguientes cargos: ');
            var DeleteQuery = "DELETE FROM cargosxcarrera WHERE ";

            var i;

            for (i = 0, len = cargos.length; i < len - 1; i++) {
                DeleteQuery = DeleteQuery + cargos[i] + " OR ";
            }

            DeleteQuery = DeleteQuery + cargos[i];

            console.log(DeleteQuery);
            con.query(DeleteQuery, function (err, result) {

                if (err) throw err;
                console.log('eliminados');
                console.log("redireccionado");
                res.redirect('/gestionar_cargos');

            });
        }
        else{
            res.redirect('/gestionar_cargos');
        }

    }
    else if ( req.body.updateCargos == 'Guardar' ){

        console.log('Cambios Guardados ');
        console.log("redireccionado");
        res.redirect('/index');

    }
    else if ( req.body.updateCargos == 'AgregarExistente' ) {

        var codigo_cargo = req.body.CargosExistentes.split(" - ");
        codigo_cargo = codigo_cargo[0];
        sess = req.session;

        con.query("INSERT INTO cargosxcarrera (Carrera_IDCarrera, Cargo_IDCargo, PeriodoElectoral_IDPE, Conformado) VALUES ('"+req.body.CarreraDeCargo+"', '"+codigo_cargo+"', '"+sess.PeridoAct.IDPE+"', '0' )", function (err, result) {

            if (err) throw err;
            console.log ('agregado existente');
            console.log("redireccionado");
            res.redirect('/gestionar_cargos');

        });


    }
    else{

        con.query("INSERT INTO cargo (NombreCargo, descripcion ) VALUES ('"+req.body.NombreNuevoCargo+"', '"+req.body.DescNuevoCargo+"' )", function (err, result) {

            if (err) throw err;
            console.log ('cargo creado');

            con.query("INSERT INTO cargosxcarrera (Carrera_IDCarrera, Cargo_IDCargo, PeriodoElectoral_IDPE, Conformado) VALUES ('"+req.body.Carrera_Cargo+"', '"+result.insertId+"', '"+sess.PeridoAct.IDPE+"', '0' )", function (err, result) {

                if (err) throw err;
                console.log ('agregado nuevo cargo');
                console.log("redireccionado");
                res.redirect('/gestionar_cargos');

            });

        });



    }


});

app.get( "/totalizacion" , requireLogin, function( req, res ){


    sess = req.session;

    if(sess.PeridoAct == null){

        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Totalización de Votos", mensaje: "Actualmente, no hay ningún período activo."  });

    }
    if(  new Date() > new Date(sess.PeridoAct.FechaFV)  ) {

    con.query("SELECT IDCarrera, Nombre FROM  carrera ", function (err, result, fields) {

        res.render( "Comision-SeleccionC-11", { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList,
            next_page: '/totalizacion', titulo:"Totalización de Votos Emitidos", subtitulo: "Seleccione la Carrera:", lista: result
        });


    });
    }
    else {
        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Totalización de Votos", mensaje: "La totalización de votos no está disponible en este momento."  });
    }



});

app.get( "/totalizacion/:carrera" , requireLogin, function( req, res ){

    con.query("SELECT carrera.IDCarrera, cargo.IDCargo, cargo.NombreCargo, carrera.Nombre,\n" +
            "egresado.NombreEgresado, egresado.ApellidoEgresado, post.Fotografia ,post.Votos\n" +
            "FROM carrera, cargo, cargosxcarrera as cxc, postulacion as post, egresado\n" +
            "WHERE carrera.IDCarrera = cxc.Carrera_IDCarrera\n" +
            "AND cxc.Cargo_IDCargo = cargo.IDCargo\n" +
            "AND cargo.IDCargo = post.IDCargo1\n" +
            "AND post.CIEgresado = egresado.CI\n" +
            "AND post.IDPE1 = '"+sess.PeridoAct.IDPE+"'\n" +
            "AND carrera.IDCarrera = '"+req.params.carrera+"'\n" +
            "ORDER BY cargo.NombreCargo, post.votos  DESC", function (err, result, fields) {

        sess = req.session;

        res.render( "Comision-Totalizacion-21", { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList,
                                                  resultados: result, carrera:result[0].Nombre});


    });



});

app.get ( "/conformacion" , requireLogin, function(req, res){

    sess = req.session;


    if(sess.PeridoAct == null){

        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Conformación de Papeletas", mensaje: "Actualmente, no hay ningún período activo."  });

    }
    if(  new Date() < new Date(sess.PeridoAct.FechaIV) && new Date() >= new Date(sess.PeridoAct.FechaFP) ) {

        con.query("SELECT DISTINCT IDCargo, NombreCargo " +
                  "FROM  cargo, postulacion        " +
                  "WHERE cargo.IDCargo = postulacion.IDCargo1      " +
                  "AND postulacion.IDPE1 = '"+sess.PeridoAct.IDPE+"'       ", function (err, result, fields) {


            res.render( "Comision-PreConformacion-26", { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList, lista: result });


        });

    }
    else {
        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Conformación de Papeletas", mensaje: "La conformacion de papeletas no está disponible en este momento."  });
    }


});

app.post ( "/conformacion" , requireLogin, function(req, res) {


    var UpdateQuery = "UPDATE postulacion " +
        "SET  ValidadaCE = 0 " +
        "WHERE IDcargo1 = '" + req.body.cargo + "'";


    con.query(UpdateQuery, function (err, result) {
        if (err) throw err;
    });

    if ( req.body.seleccionados){

        var select = req.body.seleccionados;

        UpdateQuery = "UPDATE postulacion " +
            "SET  ValidadaCE = 1 WHERE ";

        var i;

        for (i = 0, len = select.length; i < len - 1; i++) {
            UpdateQuery = UpdateQuery + " IDPostulacion = " + select[i] + " OR ";
        }

        UpdateQuery = UpdateQuery + " IDPostulacion = " + select[i];

        con.query(UpdateQuery, function (err, result) {
            if (err) throw err;
        });

    }

    res.redirect("/conformacion");



});

app.get ( "/conformacion/:cargo" , requireLogin, function(req, res){


    sess = req.session;


    con.query("SELECT Egresado.NombreEgresado, Egresado.ApellidoEgresado, Egresado.CI, cargo.NombreCargo,  cargo.IDCargo , postulacion.IDPostulacion, postulacion.ValidadaCE\n" +
            "FROM  cargo, Egresado, postulacion\n" +
            "WHERE Egresado.CI = postulacion.CIEgresado\n" +
            "AND postulacion.IDCargo1 = cargo.IDCargo\n" +
            "AND cargo.IDCargo = '"+req.params.cargo+"' " +
            "AND postulacion.IDPE1 = '"+sess.PeridoAct.IDPE+"'\n" +
            "AND postulacion.ValidadaEscuela = '1'", function (err, result, fields) {




        res.render( "comision-ConformacionPapeletas-28.ejs", { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList, lista: result });

    });

});

app.get( "/asignacion_final" , requireLogin, function( req, res ){

    sess = req.session;


    if(sess.PeridoAct == null){

        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Asignación Final de los Cargos", mensaje: "Actualmente, no hay ningún período activo."  });

    }
    if(  new Date() >= new Date(sess.PeridoAct.FechaFV) && new Date() < new Date(sess.PeridoAct.FechaFin)  ) {

        con.query("SELECT DISTINCT IDCargo, NombreCargo " +
                  "FROM  cargo, postulacion " +
                  "WHERE cargo.IDCargo = postulacion.IDCargo1 " +
                  "AND postulacion.IDPE1 = '"+sess.PeridoAct.IDPE+"' ", function (err, result, fields) {

            res.render( "Comision-AsignacionFinal2-30", { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList, lista: result });


        });

    }
    else {
        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Asignación Final de los Cargos", mensaje: "La asignación final de los cargos no está disponible aún."  });
    }

});

app.post( "/asignacion_final" , requireLogin, function( req, res ){


    var UpdateQuery = "UPDATE postulacion " +
        "SET  principal = 0, suplente = 0";

    con.query( UpdateQuery, function (err, result) {
        if (err) throw err;
    });

    UpdateQuery = "UPDATE postulacion SET principal = 1 WHERE IDPostulacion = "+req.body.principal;

    con.query( UpdateQuery, function (err, result) {
        if (err) throw err;
    });

    UpdateQuery = "UPDATE postulacion SET suplente = 1 WHERE IDPostulacion = "+req.body.suplente;

    con.query( UpdateQuery, function (err, result) {
        if (err) throw err;
    });


    res.redirect("/asignacion_final");

});

app.get( "/asignacion_final/:cargo" , requireLogin, function( req, res ){

    sess = req.session;

    con.query(  "SELECT Egresado.NombreEgresado, Egresado.ApellidoEgresado, Egresado.CI, cargo.NombreCargo, " +
                "       cargo.IDCargo, postulacion.IDPostulacion, postulacion.Votos, postulacion.principal, postulacion.suplente\n" +

                "FROM  cargo, Egresado, postulacion\n" +
                "WHERE Egresado.CI = postulacion.CIEgresado\n" +
                "AND postulacion.IDCargo1 = cargo.IDCargo\n" +
                "AND cargo.IDCargo = "+req.params.cargo+ "\n" +
                "AND postulacion.IDPE1 = '"+sess.PeridoAct.IDPE+"' \n" +
                "GROUP BY  Egresado.NombreEgresado, Egresado.ApellidoEgresado, Egresado.CI, cargo.NombreCargo,  cargo.IDCargo,\n" +
                "          postulacion.IDPostulacion, postulacion.Votos   \n" +
                "ORDER BY postulacion.Votos DESC", function (err, result, fields) {


        res.render( "Comision-AsignacionFinal3-22", { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList, lista: result });

    });





});

app.get('/generar_reporte', requireLogin, function(req, res) {

    sess = req.session;

    if(sess.PeridoAct == null){

        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Generar Reporte Impreso", mensaje: "Actualmente, no hay ningún período activo."  });

    }
    if(  new Date() > new Date(sess.PeridoAct.FechaFV)  ) {

        res.render( 'comision-GenerarReportes-19.ejs', { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList });

    }
    else {
            res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
                titulo: "Generar Reporte Impreso", mensaje: "La generación de reportes impresos no está disponible en este momento."  });
    }
});

app.get('/reporte_periodo_actual', requireLogin, function(req, res) {

    con.query("SELECT cargo.IDCargo, cargo.NombreCargo,\n" +
                "egresado.NombreEgresado, egresado.ApellidoEgresado, post.Votos, carrera.Nombre as NombreCarrera\n" +
                "FROM cargo, postulacion as post, egresado, carrera\n" +
                "WHERE cargo.IDCargo = post.IDCargo1\n" +
                "AND post.CIEgresado = egresado.CI\n" +
                "AND egresado.Carrera_IDCarrera = carrera.IDCarrera\n" +
                "AND post.IDPE1 = '"+sess.PeridoAct.IDPE+"'\n" +
                "ORDER BY cargo.NombreCargo, post.votos DESC", function (err, result, fields) {

        sess = req.session;

        xlsmaker.GenerateExcel( result , res );


    });

});

app.get('/candidatos_comision/:carrera', requireLogin, function(req,res){

    sess = req.session;

    if(sess.PeridoAct == null){

        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Conformación de Papeletas", mensaje: "Actualmente, no hay ningún período activo."  });

    }
    if(  new Date() < new Date(sess.PeridoAct.FechaFV) && new Date() >= new Date(sess.PeridoAct.FechaFP) ) {


        con.query( "SELECT DISTINCT cargo.IDCargo, cargo.NombreCargo, carrera.IDCarrera, carrera.Nombre \n" +
                    "FROM  cargo, cargosxcarrera, carrera\n" +
                    "WHERE cargo.IDCargo = cargosxcarrera.Cargo_IDCargo\n" +
                    "AND   cargosxcarrera.Carrera_IDCarrera = carrera.IDCarrera\n" +
                    "AND   carrera.IDCarrera = '"+req.params.carrera+"' " +
                    "AND   cargosxcarrera.PeriodoElectoral_IDPE = '"+sess.PeridoAct.IDPE+"' ", function (err, result, fields) {

            res.render( "comision-candidatos-cargos", { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList, cargo : sess.cargo ,lista: result });

        });

    }
    else {
        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Conformación de Papeletas", mensaje: "El listado de candidatos no está disponible aún."  });
    }



});

app.get('/candidatos_comision/:carrera/:cargo', requireLogin, function(req,res){


        con.query("SELECT NombreCargo FROM cargo WHERE IDCargo ='"+1000+"'", function (err, result, fields) {
            sess = req.session;

            NombreCargo = result[0].NombreCargo;

            console.log(NombreCargo);

            con.query("SELECT eg.CI, concat_ws(' ',eg.NombreEgresado,eg.ApellidoEgresado) as nombre, post.IDPostulacion as IDP "+
                "FROM egresado as eg, "+
                "periodoelectoral as PE, "+
                "postulacion as post, "+
                "propuestacampana as pro,cargo "+
                "WHERE eg.CI = post.CIEgresado "+
                "AND cargo.IDCargo=post.IDCargo1 "+
                "AND cargo.IDCargo='"+req.params.cargo+"' "+
                "group  by(eg.CI);", function (err, result, fields) {
                console.log(result);


                res.render('comision-listaCandidato',{nombreCargo:NombreCargo,SideBarList:sess.SBList,
                    IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, cargo : sess.cargo ,resultado: result});
            });

        });

});

app.get('/candidatos_promesas_comision/:IDP', requireLogin, function(req,res){


    con.query("SELECT eg.CI,PE.IDPE,concat_ws(' ',eg.NombreEgresado,eg.ApellidoEgresado) as nombre,TIMESTAMPDIFF(YEAR,eg.FechaNacim,CURDATE()) AS edad, "+
        "pro.prpuesta,eg.Email,eg.direccion,carrera.Nombre,cargo.IDCargo,cargo.NombreCargo "+
        "FROM egresado as eg, "+
        "periodoelectoral as PE, "+
        "postulacion as post, "+
        "propuestacampana as pro, "+
        "carrera, cargo "+
        "WHERE eg.CI = post.CIEgresado "+
        "AND post.IDPE1= PE.IDPE "+
        "AND pro.Postulacion_IDPostulacion=post.IDPostulacion "+
        "AND post.IDPostulacion='"+req.params.IDP+"' "+
        "AND cargo.IDCargo=post.IDCargo1 "+
        "AND carrera.IDCarrera=eg.Carrera_IDCarrera " +
        "AND PE.IDPE = '"+sess.PeridoAct.IDPE+"' "+
        "order by(eg.CI);", function (err, result, fields){

            sess = req.session;

            console.log(result);

            if(!result.length){

                con.query("SELECT eg.CI,PE.IDPE,concat_ws(' ',eg.NombreEgresado,eg.ApellidoEgresado) as nombre,TIMESTAMPDIFF(YEAR,eg.FechaNacim,CURDATE()) AS edad, \n" +
                    "eg.Email,eg.direccion,carrera.Nombre,cargo.IDCargo,cargo.NombreCargo \n" +
                    "FROM egresado as eg, \n" +
                    "periodoelectoral as PE, \n" +
                    "postulacion as post, \n" +
                    "carrera, cargo \n" +
                    "WHERE eg.CI = post.CIEgresado \n" +
                    "AND post.IDPE1= PE.IDPE \n" +
                    "AND post.IDPostulacion='3' \n" +
                    "AND cargo.IDCargo=post.IDCargo1 \n" +
                    "AND carrera.IDCarrera=eg.Carrera_IDCarrera \n" +
                    "AND PE.IDPE = '"+sess.PeridoAct.IDPE+"' "+
                    "order by(eg.CI);", function (err, result, fields){

                        res.render('comision-DatosContacto',{SideBarList:sess.SBList,
                            IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, resultado: result});



                });


            }else{
                res.render('comision-DatosContacto',{SideBarList:sess.SBList,
                    IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, cargo : sess.cargo , resultado: result});
            }


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


