var express = require('express');
var app = express();

var sess;

var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

var conector = require(rootPath +'/connect.js');
var con = conector.conectar();

module.exports = app;



function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

// This should work both there and elsewhere.
/*function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}*/

//******************************************************************//
//++++++++++++++++++  RUTAS +++++++++++++++++++++++++++++
//******************************************************************//
var NombreCargo;

app.get('/candidatos-egre/:IDCargo', requireLogin, function(req, res) {

    sess = req.session;

    if(sess.PeridoAct == null){

        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Candidatos", mensaje: "Actualmente, no hay ningún período activo."  });

    }
    else if(  new Date() < new Date(sess.PeridoAct.FechaFV) && new Date() >= new Date(sess.PeridoAct.FechaFP) ) {

        con.query("SELECT NombreCargo FROM cargo WHERE IDCargo ='"+req.params.IDCargo+"'", function (err, result, fields) {

   
      
        NombreCargo = result[0].NombreCargo;
        //QUERIE ACTUALZIADO JM 2211
                    con.query("SELECT eg.CI, concat_ws(' ',eg.NombreEgresado,eg.ApellidoEgresado) as nombre, post.IDPostulacion as IDP "+
                                "FROM egresado as eg, "+
                                 "periodoelectoral as PE, "+
                                 "postulacion as post, "+
                                 "propuestacampana as pro,cargo "+
                                "WHERE eg.CI = post.CIEgresado "+
                                "AND cargo.IDCargo=post.IDCargo1 "+
                                "AND cargo.IDCargo='"+req.params.IDCargo+"' " +
                                "AND post.ValidadaCE = '1' "+
                                "group  by(eg.CI);", function (err, result, fields) {


        res.render('egresado-listaCandidato',{nombreCargo:NombreCargo,SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, resultado: result});
    });

});
    }
    else {
        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Candidatos", mensaje: "El listado de candidatos no está disponible aún."  });
    }

});

//******************************************************************//
// RUTA PARA LLENAR LAS PROMESAS ELECTORALES AL DARLE AL "VER MAS..."
//******************************************************************//
app.get('/candidatos-promesas/:IDP', requireLogin, function(req, res) {

  sess = req.session;
      //QUERIE ACTUALZIADO JM 2211
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
                      "AND carrera.IDCarrera=eg.Carrera_IDCarrera "+ 
                      "order by(eg.CI);", function (err, result, fields){
         




        res.render('egresados-DatosContacto-3',{SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, resultado: result});
                                                                         });



});


//******************************************************************//
                      // RUTA PARA POSTULACIÓN.
//******************************************************************//
app.get('/egresado-Postulacion/', requireLogin, function(req, res) {

    sess = req.session;

    if(sess.PeridoAct == null){

        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Postulación", mensaje: "Actualmente, no hay ningún período activo."  });

    }
    else if(  new Date() >= new Date(sess.PeridoAct.FechaIP) && new Date() < new Date(sess.PeridoAct.FechaFP) ) {
      //QUERIE ACTUALZIADO JM 2211
         con.query("SELECT  cargo.NombreCargo, post.IDPE1 as IDP "+
                   "FROM cargo, Usuario as U, Egresado as eg,postulacion as post "+
                     "WHERE U.IDUsuario = eg.Usuario_IDUsuario "+
                     "AND U.NombreUsu='"+sess.NombreUsuario+"' "+
                     "AND post.IDCargo1=cargo.IDCargo "+
                     "AND post.CIEgresado= eg.CI;", function (err, result, fields){


        res.render('egresados-Postulacion',{SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, resultado: result,nombreCargos:result});
            
    });
    }
    else {
        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Postulación", mensaje: "El proceso de postulación no esta disponible."  });
    }

});
//******************************************************************//
              // RUTA PARA METER PROPUESTAS
//******************************************************************//
app.get('/AgregarPropuesta/:IDPostulacion', requireLogin, function(req, res) {

    sess = req.session;
      //QUERIE ACTUALZIADO JM 2211
con.query("SELECT  cargo.NombreCargo, post.IDPE1 as IDP "+
          "FROM cargo, Usuario as U, Egresado as eg,postulacion as post "+
          "WHERE U.IDUsuario = eg.Usuario_IDUsuario "+
          "AND U.NombreUsu='"+sess.NombreUsuario+"' "+
          "AND post.IDCargo1=cargo.IDCargo "+
          "AND post.CIEgresado= eg.CI;", function (err, result, fields){
    sess = req.session;



        

 res.render('egresados-Postulacion',{SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, resultado: result});
            
    });



});

//******************************************************************//
            // RUTA PARA LLENAR AGREGAR POSTULACIÒN"
//******************************************************************//
app.get('/egresados-postularse', requireLogin, function(req, res) {

     sess = req.session;

     //QUERIE ACTUALZIADO JM 2211
     con.query("SELECT pe.IDPE as IDP FROM periodoelectoral "+" as pe where pe.Estado !='X';", function (err, result, fields){
    
        var IDP = result[0].IDP;

   
              //QUERIE ACTUALZIADO JM 2211
              con.query("SELECT egre.CI as CI,egre.NombreEgresado FROM egresado as egre, usuario as u "
                +"WHERE egre.Usuario_IDUsuario = u.IDUsuario "
                +"AND u.IDUsuario='"+sess.IDUsuario+"';", function (err, result, fields){
    
                    var CI = result;


   
                     //QUERIE ACTUALZIADO JM 2211
                              con.query("select c.NombreCargo,c.IDCargo \n" +
                                        "FROM cargo AS c, cargosxcarrera, egresado \n" +
                                        "WHERE c.IDCargo = cargosxcarrera.Cargo_IDCargo\n" +
                                        "AND cargosxcarrera.Carrera_IDCarrera = egresado.Carrera_IDCarrera\n" +
                                        "AND egresado.Usuario_IDUsuario = '"+sess.IDUsuario+"'\n" +
                                        "AND c.IDCargo not in \n" +
                                        "(SELECT c.IDCargo FROM cargo as c,\n" +
                                        "postulacion as post,usuario as u, egresado as egr,periodoelectoral as PE \n" +
                                        "WHERE post.CIEgresado =egr.CI AND egr.Usuario_IDUsuario ='"+sess.IDUsuario+"' \n" +
                                        "AND post.IDCargo1=c.IDCargo AND c.IDCargo=post.IDCargo1 \n" +
                                        "AND PE.IDPE = '"+IDP+"' \n" +
                                        "group by c.IDCargo); ", function (err, result, fields){
    


                                            res.render('egresados-postulacion1',{SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, resultado: result,IDP:IDP, CI:CI});
                              });

  
              });
     });

});




//******************************************************************//
// RUTA PARA LLENAR AGREGAR PROPUESTAS LUEGO DE HABERSE POSTULADO PASO 2"
//******************************************************************//
app.get('/egresado-propuestas', requireLogin, function(req, res) {
sess = req.session;

//QUERIE ACTUALZIADO JM 2211
con.query("SELECT  post.IDPostulacion as IDP,post.CIEgresado as CI,post.IDPE1 as IDPE "+" FROM postulacion as post, "
  +" egresado as egre, usuario as u WHERE post.CIEgresado = egre.CI "
  +" AND egre.Usuario_IDUsuario =u.IDUsuario "+"AND u.IDUsuario='"+sess.IDUsuario+"' "
  +" ORDER BY post.IDPostulacion DESC LIMIT 1;", function (err, result, fields){
    var datospro=result;


    con.query("SELECT pro.prpuesta FROM propuestacampana as pro WHERE pro.Postulacion_IDPostulacion="+datospro[0].IDP+";", function (err, result, fields){

 res.render('egresado-propuestas',{SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario,datospro:datospro,PROCampaña:result});

 });
    });
   
});

//******************************************************************//
              //POST PARA AGREGAR POSTULACION//
//******************************************************************//

app.post('/AgregarPostulacion/', function(req, res) {

if(req.body.updateCargos == 'AgregarNuevo'){



  var nombreCargo =req.body.NombreCargoPostulado;

 
  //QUERIE ACTUALZIADO JM 2211
    con.query("SELECT c.IDCargo "+" FROM cargo as c "+" WHERE c.NombreCargo='"+nombreCargo+"';", function (err, result, fields){

         var IDCargo=result[0].IDCargo;


        //QUERIE ACTUALZIADO JM 2211
        con.query("INSERT INTO `ucabegresado`.`postulacion` (`CIEgresado`, `IDCargo1`, `IDPE1`, `Escalafon`, `Fotografia`, `PartidoPolitico`) VALUES "
        +" ( '"+req.body.CIEgresado+"', '"+IDCargo+"', '"+req.body.IDPH+"', '"+req.body.escalafon+"', 'FOTO' , '"+req.body.PP+"');"
        , function (err, result) {



            if (err){
          throw err;
            res.redirect('/egresado-Postulacion');


            }

  con.query("INSERT INTO votacion (`IDPE`, `IDPostulacion`, `TotalVotos`) "
  + "VALUES ('"+req.body.IDPH+"', '"+result.IDPostulacion+"', '0');"
  , function (err, result, fields){

                                  });            

             
        });
          });
  }//FIN IF

    res.redirect('/egresado-propuestas');
});


//******************************************************************//
              //POST PARA AGREGAR PROPUESTA//
//******************************************************************//

app.post('/gestionar_propuestas', function(req, res) {


    if( req.body.Agregarpropuesta == 'AGREGAR' ){
var CI =req.body.CI;
var IDPE =req.body.IDPE;
var IDP =req.body.IDP;
var propu= req.body.NuevaPropuesta;
     

  //QUERIE ACTUALZIADO JM 2211

con.query("INSERT INTO propuestacampana (Postulacion_IDPostulacion,prpuesta) VALUES ('"+IDP+"', '"+propu+"');"
, function (err, result) {


 });

    }

    res.redirect('/egresado-propuestas');

});


//******************************************************************//
              //GET RUTA PARA ELIMINAR POSTULACION//
//******************************************************************//

app.get('/egresados-RetirarPropuesta', requireLogin, function(req, res) {
sess = req.session;
 
//QUERIE ACTUALZIADO JM 2211
 con.query("  select c.NombreCargo,c.IDCargo "
            +" FROM cargo AS c "
            +" WHERE c.IDCargo  in "
            +" (SELECT c.IDCargo FROM cargo as c," 
            +" postulacion as post,usuario as u, egresado as egr,periodoelectoral as PE "
            +" WHERE post.CIEgresado =egr.CI AND egr.Usuario_IDUsuario ='"+sess.IDUsuario+"' "
            +" AND post.IDCargo1=c.IDCargo AND c.IDCargo=post.IDCargo1 "
            +" group by c.IDCargo); ", function (err, result, fields){

     res.render('egresado-RetirarPropuesta',{SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario,cargos:result});

    });
   
});


//******************************************************************//
              //POST PARA ELIMINAR POSTULACIÓN//
//******************************************************************//

app.post('/egresado-EliminarPostulacion', function(req, res) {

sess = req.session;
    

if( req.body.EliminarPostulacion == 'ELIMINAR' ){
  var nombreCargo =req.body.CargoEliminar;
 
  //QUERIE ACTUALZIADO JM 2211
con.query("SELECT c.IDCargo " +" FROM cargo as c "+" WHERE c.NombreCargo='"+nombreCargo+"';", function (err, result, fields){

    var IDCargo=result[0].IDCargo;


     //QUERIE ACTUALZIADO JM 2211
    con.query("SELECT p.IDPostulacion "
      +" FROM postulacion as p, egresado as e, usuario as u"
      +" WHERE p.IDCargo1='"+IDCargo+"' AND p.CIEgresado=e.CI "
      +" AND e.Usuario_IDUsuario=u.IDUsuario AND u.IDUsuario='"+sess.IDUsuario+"';"
  , function (err, result, fields){
    
    var IDPostulacion=result[0].IDPostulacion;

        con.query(" DELETE FROM propuestacampana WHERE Postulacion_IDPostulacion='"+IDPostulacion+"';"
          , function (err, result, fields){

                                          });

        con.query(" DELETE FROM votacion WHERE IDPostulacion='"+IDPostulacion+"';"
          , function (err, result, fields){

                                          });

          con.query(" DELETE FROM postulacion WHERE IDPostulacion='"+IDPostulacion+"';"
          , function (err, result, fields){

                                          });


          res.redirect('/egresado-Postulacion');

                                });

                     });
          } // fin if eliminar

});

//******************************************************************//
              //GET RUTA PARA  VOTACION//
//******************************************************************//

//******************************************************************//
//GET RUTA PARA  VOTACION//
//******************************************************************//

app.get('/egresado-InicioVotacion', requireLogin, function(req, res) {
    sess = req.session;

    if(sess.PeridoAct == null){

        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Votación", mensaje: "Actualmente, no hay ningún período activo."  });

    }
    if(  new Date() >= new Date(sess.PeridoAct.FechaIV) && new Date() < new Date(sess.PeridoAct.FechaFV) ) {

        con.query(" SELECT IF( EXISTS( SELECT * FROM votacion "
            +" WHERE votacion.IDVotante='"+sess.IDUsuario+"' ), 1, 0) as existe;"
            , function (err, result, fields) {
                console.log(result);
                console.log("ENTRO AL EGRESADO INICIO")

                if (result[0].existe == 0) {
                    res.render('egresado-InicioVotacion', {
                        SideBarList: sess.SBList,
                        IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuari
                    });
                }

                else {
                    res.render('egresados-YaVoto', {
                        SideBarList: sess.SBList,
                        IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuari
                    });
                }
            });

    } else {
        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Votación", mensaje: "El proceso de votación no esta disponible."  });
    }


});




//******************************************************************//
//GET RUTA PARA INICIAR VOTACION//
//******************************************************************//

app.get('/egresado-IVotacion', requireLogin, function(req, res) {
    sess = req.session;

    //QUERIE ACTUALZIADO JM 2211
    con.query("SELECT p.IDCargo1,c.NombreCargo \n" +
            "FROM postulacion as p,cargo as c, usuario as u, egresado as e, cargosxcarrera as cxc\n" +
            "WHERE u.IDUsuario = '"+sess.IDUsuario+"'\n" +
            "AND u.IDUsuario = e.Usuario_IDUsuario\n" +
            "AND e.Carrera_IDCarrera = cxc.Carrera_IDCarrera\n" +
            "AND c.IDCargo = cxc.Cargo_IDCargo\n" +
            "AND p.IDcargo1=c.IDCargo \n" +
            "group by p.IDCArgo1;" , function (err, result, fields){

            var cargos=result;

//QUERIE ACTUALZIADO JM 2211
            con.query("select concat_ws(' ',e.NombreEgresado, E.ApellidoEgresado) as nombre,p.IDCargo1, p.IDPostulacion"
                +" FROM egresado as e, postulacion as p "
                +" WHERE e.CI=p.CIEgresado "
                +"AND p.ValidadaEscuela='1' "
                +"AND p.ValidadaCE='1' "
                +" order by p.IDCargo1;"
                , function (err, result, fields){



                    res.render('egresado-IVotacion',{SideBarList:sess.SBList,
                        IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuari,
                        cargos:cargos,nombreE:result});



                });
        });
});
//******************************************************************//
//POST PARA INICIAR VOTACIÓN//
//******************************************************************//

app.post('/egresado-Votacion',requireLogin, function(req, res) {
    sess = req.session;

    if( req.body.InicioVotacion == 'Iniciar' ){

        res.redirect('/egresado-IVotacion');

    } // if iniciar

    if(req.body.InicioVotacion == 'votar'){

        //AGREGAR EGRESADO A TABLA DE QUE YA VOTO
        con.query("INSERT INTO `ucabegresado`.`votacion` (`IDPE`, `IDVotante`) VALUES ('"+sess.PeridoAct.IDPE+"','"+sess.IDUsuario+"');", function (err, result, fields){
                console.log(result);
        });


        var vo = req.body.cargos;
        var query = "UPDATE `ucabegresado`.`postulacion` SET `Votos`=`Votos`+1 WHERE ";
        var i = 0;

        console.log("casillas seleccionadas:");

        for ( len=vo.length ; i <(len-1); i++)
        {
            console.log(vo[i]);
            query = query + " `IDPostulacion`= '" + vo[i] +"' OR "
        } //for

        query = query + " `IDPostulacion`= '" + vo[i] +"' "


        con.query( query , function (err, result, fields){

            res.redirect("/index");

         });





    } // if votar
});


//******************************************************************//
              //GET RUTA PARA  RESULTADOS//
//******************************************************************//

app.get('/egresados-Resultados', requireLogin, function(req, res) {
sess = req.session;

console.log ( new Date(sess.PeridoAct.FechaFV) + " >=  " + new Date() + " < " + new Date(sess.PeridoAct.FechaFin) );

    if(sess.PeridoAct == null){

        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Resultado de las Elecciones", mensaje: "Actualmente, no hay ningún período activo."  });

    }
    else if(  new Date() >= new Date(sess.PeridoAct.FechaFV) && new Date() < new Date(sess.PeridoAct.FechaFin)   ) {

        //query que devuelve los resultados de las elecciones y los ordena por cargo de forma descendete
        //QUERIE ACTUALZIADO JM 2211
        con.query("SELECT c.IDCargo,c.NombreCargo, concat_ws(' ',e.NombreEgresado,e.ApellidoEgresado) as nombre, p.IDPostulacion,v.TotalVotos "
          +" FROM votacion as v, egresado as e, cargo as c, postulacion as p,usuario as u "
          +" WHERE p.IDPostulacion =v.IDPostulacion "
          +" AND p.IDPE1=v.IDPE "
          +" AND p.CIEgresado =e.CI "
          +" AND c.IDCargo=p.IDcargo1  group by v.TotalVotos desc; "
          , function (err, result, fields){

                GANADOR=result;

                    //QUERIE ACTUALZIADO JM 2211
                con.query(" SELECT p.IDCargo1,c.NombreCargo "
                  +" FROM postulacion as p,cargo as c "
                  +" WHERE p.IDcargo1=c.IDCargo "
                  +" group by p.IDCArgo1;"
                  , function (err, result, fields){


                        res.render('egresados-Resultados-14',{SideBarList:sess.SBList,
                                             IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuari,GANADOR:GANADOR, cargos:result});

                }); // 2do QUERY
            }); // 1er  query


    }
    else {
        res.render('error_fecha.ejs', { IDUsuario: sess.IDUsuario, NombreUsu: sess.NombreUsuario, SideBarList: sess.SBList, cargo: sess.cargo,
            titulo: "Resultado de las Elecciones", mensaje: "La lista de resultados no esta disponible aún."  });
    }

}); // GET


//******************************************************************//
              //GET RUTA PARA VER PERFIL//
//******************************************************************//

app.get('/egresados-Perfil', requireLogin, function(req, res) {
sess = req.session;

//QUERIE ACTUALZIADO JM 2211
 con.query("SELECT concat_ws(' ',e.NombreEgresado,e.ApellidoEgresado) as nombre,c.Nombre as NombreC,e.Tlf,e.direccion,e.Email "
  +" FROM egresado as e, carrera as c,usuario as u "
  +" WHERE e.Usuario_IDUsuario=u.IDUsuario "
  +" AND u.IDUsuario='"+sess.IDUsuario+"';", function (err, result, fields){

     res.render('egresados-Perfil',{SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario,datos:result});

    });
   
});

//******************************************************************//
              //GET RUTA PARA EDITAR PERFIL//
//******************************************************************//

app.get('/egresados-Editar', requireLogin, function(req, res) {
sess = req.session;


//QUERIE ACTUALZIADO JM 2211
con.query(  "SELECT e.CI,concat_ws(' ',e.NombreEgresado,e.ApellidoEgresado) as nombre,c.Nombre as NombreC, c.IDCarrera,\n" +
            "       e.Tlf, e.Email, e.direccion\n" +
            "FROM egresado as e, carrera as c,usuario as u \n" +
            "WHERE e.Usuario_IDUsuario=u.IDUsuario \n" +
            "AND c.IDCarrera = e.Carrera_IDCarrera\n" +
            "AND u.IDUsuario='"+sess.IDUsuario+"';", function (err, result, fields){

     res.render('egresados-Guardar-12',{SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario,datos:result});

    
   });
});


//******************************************************************//
              //POST PARA GUARDAR CAMBIOS PERFIL//
//******************************************************************//

app.post('/Editar-Perfil', function(req, res) {
sess = req.session;

    if( req.body.EditarPerfil == 'Guardar' ){


var tlf=req.body.Telefono;
var Email=req.body.Email;
var Dirección=req.body.Dirección;
var CI=req.body.CI;
var IDCarrera=req.body.IDCarrera;


//QUERIE ACTUALZIADO JM 2211
con.query("UPDATE egresado SET `Tlf`='"+tlf+"', "
  +" `Email`='"+Email+"', `direccion`='"+Dirección+"'"
  +" WHERE `CI`='"+CI+"' and`Usuario_IDUsuario`='"+sess.IDUsuario
  +"' and `Carrera_IDCarrera`='"+IDCarrera+"';"
  , function (err, result, fields){



    res.redirect('/egresados-Perfil');
 
    
  
});
}// if GUARDAR
});

//******************************************************************//
              // DE AQUI PARA ABAJO NUEVO//
//******************************************************************//


//==============================================================================================
//==============================REGISTRO========================================================
//==============================================================================================

//******************************************************************//
//GET RUTA REGISTRO EGRESADO//
//******************************************************************//
app.get('/egresados-Registro', function(req, res) {

    res.render('egresados-registro-1');

});

//******************************************************************//
//POST PARA REGISTRAR USUARIO//
//******************************************************************//
app.post('/egresado-Registro', function(req, res) {

    var CI= req.body.CI;


    if( CI=="")
    {
        res.render('egresados-registro-1');
    }
    else{


//QUERIE ACTUALZIADO JM 2211
        con.query("SELECT IF( EXISTS( SELECT * FROM egresado "
            +" WHERE egresado.CI='"+CI+"' ), 1, 0) as existe;"
            , function (err, result, fields){




                if(result[0].existe==0)
                {

                    res.redirect('/egresados-registroNuevo');
                }
                else
                {

                    res.redirect('/egresado-registro-2/'+CI);
                }
            });
    }

});



//******************************************************************//
              //GET RUTA REGISTRO EGRESADO NO EN SISTEMA//
//******************************************************************//
app.get('/egresados-registroNuevo', function(req, res) {

  //QUERIE ACTUALZIADO JM 2211
con.query("SELECT * FROM carrera;"
  , function (err, result, fields){


res.render('egresados-registro-nuevo',{carrera:result});

 }); 
   
});

//******************************************************************//
//POST PARA REGISTRAR USUARIO NO EXISTENTE//
//******************************************************************//
app.post('/egresado-RegistroNuevo', function(req, res) {

    var CI= req.body.CI;
    var nombre= req.body.nombreE;
    var apellidoE= req.body.apellidoE;
    var email= req.body.Email;
    var tlf= req.body.tlf;
    var fenac= req.body.fenac;
    var direccion= req.body.Dirección;
    var carrera= req.body.carrera;



    con.query("SELECT c.IDCarrera FROM carrera as c WHERE c.Nombre='"+carrera+"';", function (err, result, fields){



            var IDCarrera= result[0].IDCarrera;

            query = "INSERT INTO egresado (`CI`, `NombreEgresado`, `ApellidoEgresado`, `Tlf`, `Email`, `direccion`, `FechaNacim`, `Carrera`, `Carrera_IDCarrera`, `Usuario_IDUsuario`, `preguntaSeg`, `respuestaSeg`)"
                +" VALUES ('"+CI+"', '"+nombre+"','"+apellidoE+"', '"+tlf+"','"+email+"','"+direccion+"','"+fenac+"', '"+IDCarrera+"', '"+IDCarrera+"',"



                res.render('egresados-registro-4N',{ci:CI, queryEgresado : query});

        });

});


//******************************************************************//
              //GET RUTA REGISTRO EGRESADO  EN SISTEMA//
//******************************************************************//
app.get('/egresado-registro-2/:CI', function(req, res) {


//QUERIE ACTUALZIADO JM 2211
con.query(" SELECT DE.CIEgresado,concat_ws(' ',eg.NombreEgresado,eg.ApellidoEgresado) as nombre,DE.Correoucab, DE.AnoEgreso "
  +" FROM datosegresado as DE, egresado as eg "
  +" WHERE DE.CIEgresado ='"+req.params.CI+"' "
  +" AND DE.CIegresado=eg.CI;"
  , function (err, result, fields){


 res.render('egresados-registro-2',{datosE:result});  
});

});


//******************************************************************//
              //post PARA REGISTRO USUARIO PASO 3//
//******************************************************************//
app.post('/egresado-registro3', function(req, res) {


var CI= req.body.CI;
var nombre= req.body.nombre;
var AnoE= req.body.AñoEgresado;
var respuesta= req.body.respuesta;


 var datos={CI:CI,nombre:nombre,AnoE:AnoE,respuesta:respuesta};

if(respuesta+" " == AnoE)
{
res.render('egresados-registro-3',{datos:datos});
}  
else{

   res.redirect('/egresados-Registro');
}   
 
});



//******************************************************************//
//GET RUTA REGISTRO  USUARIO NO EN SISTEMA DE PASO 2 A 4//
//******************************************************************//
app.get('/registro-egresado4', function(req, res) {

    res.render('egresados-registro-4N');

});

//******************************************************************//
     //post PARA REGISTRO USUARIO PASO 4 USUARIO EN SISTEMA//
//******************************************************************//
app.post('/registro-egresado4', function(req, res) {


var usu= req.body.usuario;
var CI= req.body.CI.replace(/\s/g,'');
var pass= req.body.pass;
var pass2= req.body.pass2;
var preg= req.body.preg;
var resp= req.body.resp;



if(pass == pass2)
{

con.query("INSERT INTO `usuario` (`NombreUsu`, `ClaveUsu`, `Cargo`) "
        +" VALUES ('"+usu+"', '"+pass+"', '3');", function (err, result, fields){


con.query("SELECT IDUsuario FROM ucabegresado.usuario "+
            "WHERE Nombreusu='"+usu+"';", function (err, result, fields){

              


con.query("UPDATE egresado SET `preguntaSeg`='"+preg+"', `respuestaSeg`='"+resp+"',`Usuario_IDUsuario`='"+result[0].IDUsuario+"'  "
  +" WHERE `CI`='"+CI+"';"
  , function (err, result, fields){

    res.redirect('/login');
                                  }); 

                                }); //fin del query idusu
}); //query usuario insert

}  
else{

  
}   
});



//******************************************************************//
//GET RUTA REGISTRO  USUARIO SISTEMA PASO 4//
//******************************************************************//
app.get('/egresados-registro-4N', function(req, res) {

    res.render('egresados-registro-4N');

});

//******************************************************************//
     //post PARA REGISTRO USUARIO PASO 4 NO  USUARIO EN SISTEMA//
//******************************************************************//
app.post('/registro-egresado4N', function(req, res) {


var usu= req.body.usuario;
var CI= req.body.CI;
var pass= req.body.pass;
var pass2= req.body.pass2;
var preg= req.body.preg;
var resp= req.body.resp;


 if(pass == pass2)
{

con.query("INSERT INTO `usuario` (`NombreUsu`, `ClaveUsu`, `Cargo`) VALUES ('"+usu+"', '"+pass+"', '3');", function (err, result, fields){



    con.query( req.body.QueryInsertEgresado+"'"+result.insertId+"', '"+preg+"', '"+resp+"');", function (err, result, fields){

        res.redirect('/login');


    });
}); //query usuario insert

}  
else{
} 

});


//******************************************************************//
              //get PARA REGISTRO USUARIO PASO 4//
//******************************************************************//
app.post('/updateEgre', function(req, res) {


var CI= req.body.CIE;
var direccion= req.body.direccion;
var tlf= req.body.telefono;
var Email= req.body.email;

//UPDATE `ucabegresado`.`egresado` SET `Tlf`='0424123456', `Email`='juanjose1@gmail.com', `direccion`='villa africana puerto ordazz' WHERE `CI`='1111' and`Usuario_IDUsuario`='5' and`Carrera_IDCarrera`='1000';

con.query("UPDATE `ucabegresado`.`egresado` SET `Tlf`='"+tlf+"', `Email`='"+Email+"', `direccion`='"+direccion+"' "
+" WHERE `CI`='"+CI+"';"
  , function (err, result, fields){



    res.render('egresados-registro-4',{CI:CI});
 
});

});



//==============================================================================================
//==============================================================================================

//******************************************************************//
//GET RUTA RECUPERACION CONTRASEÑA//
//******************************************************************//

app.get('/egresados-recuperacionCon', function(req, res) {

    res.render('egresados-recuperacionCon');

});

//******************************************************************//
//POST RECUPERAR CONTRASEÑA PASO 2//
//******************************************************************//

app.post('/egresado-Recuperacion', function(req, res) {

    var CIE=req.body.CIEmail;




    //QUERIE ACTUALZIADO JM 2211
    con.query("SELECT IF( EXISTS(SELECT Usuario_IDUsuario, preguntaSeg,respuestaSeg "+
        " FROM egresado "+
        "WHERE CI='"+CIE+"' "+
        "OR EMAIL='"+CIE+"' ), 1, 0) as existe;"
        , function (err, result, fields){


            //si existe ese usuario
            if(result[0].existe==1)
            {
                con.query("SELECT Usuario_IDUsuario, preguntaSeg,respuestaSeg "+
                    " FROM egresado "+
                    "WHERE CI='"+CIE+"' "+
                    "OR EMAIL='"+CIE+"';"
                    , function (err, result, fields){





                        res.render('egresados-recuperacionCon-2',{datos:result});

                    }); // query existe

            }
            else
            {
                res.render( "error_cedula_inexistente.ejs" );
            }
        }); // query existe

});//fin post


//******************************************************************//
     //GET RUTA RECUPERACION CONTRASEÑA PASO 2 PREGUNTA SEG//
//******************************************************************//

app.get('/egresados-recupCon-2', function(req, res) {
  

  con.query("SELECT Usuario_IDUsuario, preguntaSeg,respuestaSeg "+
  " FROM egresado "+
   "WHERE CI='"+CIE+"' "+
   "OR EMAIL='"+CIE+"';"
   , function (err, result, fields){


 
     res.render('egresados-recuperacionCon-2',{datos:result});


 }); // query existe

  
  });


//******************************************************************//
              //POST RECUPERAR CONTRASEÑA PASO 3//
//******************************************************************//

app.post('/egresado-Recuperacion2', function(req, res) {
  

    
    var respu=req.body.Respu;
    var respubd=req.body.Respubd;
    var usubd=req.body.usuBD;
  

    if(respu==respubd)
    {

      con.query("SELECT u.NombreUsu FROM egresado,usuario as u "
      +" WHERE u.IDUsuario = egresado.Usuario_IDUsuario AND u.IDUsuario='"+usubd+"';"
       , function (err, result, fields){


        
         res.render('egresados-recuperacionCon-3',{datos:result, usubd: usubd});
    
     }); // query existe
    }  
    else
    {
      res.redirect('/egresados-recuperacionCon-2');
    } 

    });//fin post


//******************************************************************//
              //POST RECUPERAR CONTRASEÑA PASO 4 guardar contraseñas//
//******************************************************************//

app.post('/egresado-Recuperacion3', function(req, res) {
  

    var Contraseña=req.body.Contraseña;
    var Contraseña1=req.body.Contraseña1;
    var usubd=req.body.usuBD;

  
    if(Contraseña==Contraseña1)
    {

      con.query("UPDATE usuario SET ClaveUsu='"+Contraseña+"' WHERE `IDUsuario`='"+usubd+"';"
       , function (err, result, fields){


         res.render('login');
    
     }); // query existe
    }  

    });//fin post




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
