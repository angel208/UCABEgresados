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


//++++++++++++++++++  RUTAS +++++++++++++++++++++++++++++

     var NombreCargo;
app.get('/candidatos-egre/:IDCargo', requireLogin, function(req, res) {

    con.query("SELECT NombreCargo FROM cargo WHERE IDCargo ='"+req.params.IDCargo+"'", function (err, result, fields) {
        sess = req.session;
   
      
        NombreCargo = result[0].NombreCargo;

                    con.query("SELECT eg.CI, concat_ws(' ',eg.NombreEgresado,eg.ApellidoEgresado) as nombre, post.IDPostulacion as IDP "+
                                "FROM egresado as eg, "+
                                 "periodoelectoral as PE, "+
                                 "postulacion as post, "+
                                 "propuestacampana as pro,cargo "+
                                "WHERE eg.CI = post.CIEgresado "+
                                "AND cargo.IDCargo=post.IDCargo1 "+
                                "AND cargo.IDCargo='"+req.params.IDCargo+"' "+
                                "group  by(eg.CI);", function (err, result, fields) {
                                console.log(result);
                      


        

        res.render('egresado-listaCandidato',{nombreCargo:NombreCargo,SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, resultado: result});
    });

});

});

// RUTA PARA LLENAR LAS PROMESAS ELECTORALES AL DARLE AL "VER MAS..."
app.get('/candidatos-promesas/:IDP', requireLogin, function(req, res) {

   
      
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
    sess = req.session;


        console.log(result);

        res.render('egresados-DatosContacto-3',{SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, resultado: result});
    });



});



// RUTA PARA POSTULACIÓN.
app.get('/egresado-Postulacion/', requireLogin, function(req, res) {

    sess = req.session;
      
         con.query("SELECT  cargo.NombreCargo, post.IDPE1 as IDP "+
"FROM cargo, Usuario as U, Egresado as eg,postulacion as post "+
"WHERE U.IDUsuario = eg.Usuario_IDUsuario "+
"AND U.NombreUsu='"+sess.NombreUsuario+"' "+
"AND post.IDCargo1=cargo.IDCargo "+
"AND post.CIEgresado= eg.CI;", function (err, result, fields){
    sess = req.session;


        console.log(result);

        

        res.render('egresados-Postulacion',{SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, resultado: result,nombreCargos:result});
            
    });


});

// RUTA PARA METER PROPUESTAS
app.get('/AgregarPropuesta/:IDPostulacion', requireLogin, function(req, res) {

    sess = req.session;
      
con.query("SELECT  cargo.NombreCargo, post.IDPE1 as IDP "+
"FROM cargo, Usuario as U, Egresado as eg,postulacion as post "+
"WHERE U.IDUsuario = eg.Usuario_IDUsuario "+
"AND U.NombreUsu='"+sess.NombreUsuario+"' "+
"AND post.IDCargo1=cargo.IDCargo "+
"AND post.CIEgresado= eg.CI;", function (err, result, fields){
    sess = req.session;



        console.log(result);

        

 res.render('egresados-Postulacion',{SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, resultado: result});
            
    });



});




// RUTA PARA LLENAR AGREGAR POSTULACIÒN"
app.get('/egresados-postularse/:IDP', requireLogin, function(req, res) {
sess = req.session;
   con.query("SELECT pe.IDPE as IDP FROM ucabegresados.periodoelectoral "
    +" as pe where pe.Estado ='I';", function (err, result, fields){
    
    var IDP = result;
    console.log(IDP);
   
      
      con.query("SELECT egre.CI as CI,egre.NombreEgresado FROM ucabegresados.egresado as egre, usuario as u "
        +"WHERE egre.Usuario_IDUsuario = u.IDUsuario "
        +"AND u.IDUsuario='"+sess.IDUsuario+"';", function (err, result, fields){
    
    var CI = result;
    console.log("CEDULA EGRESADOOOOOO");
    console.log(CI[0].CI);
   

          con.query("  select c.NombreCargo,c.IDCargo "
            +" FROM cargo AS c "
            +" WHERE c.IDCargo not in "
            +" (SELECT c.IDCargo FROM cargo as c," 
            +" postulacion as post,usuario as u, egresado as egr,periodoelectoral as PE "
            +" WHERE post.CIEgresado =egr.CI AND egr.Usuario_IDUsuario ='"+sess.IDUsuario+"' "
            +" AND post.IDCargo1=c.IDCargo AND c.IDCargo=post.IDCargo1 "
            +" group by c.IDCargo) ", function (err, result, fields){
    
console.log(sess.IDUsuario);

        console.log(result);

        res.render('egresados-postulacion1',{SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, resultado: result,IDP:IDP, CI:CI});
      });

  
    });
  });
});





// RUTA PARA LLENAR AGREGAR PROPUESTAS LUEGO DE HABERSE POSTULADO PASO 2"
app.get('/egresado-propuestas', requireLogin, function(req, res) {
sess = req.session;


con.query("SELECT  post.IDPostulacion as IDP,post.CIEgresado as CI,post.IDPE1 as IDPE "+" FROM ucabegresados.postulacion as post, "
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


con.query("select count(*) as cc from postulacion", function (err, result, fields){
  
  var cantidad = result[0].cc;
  console.log(cantidad);

  var nombreCargo =req.body.NombreCargoPostulado;
  console.log(nombreCargo);
 
con.query("SELECT c.IDCargo "
  +" FROM cargo as c "
  +" WHERE c.NombreCargo='"+nombreCargo+"';", function (err, result, fields){

    var IDCargo=result[0].IDCargo;

    console.log("///////////////////////")
    console.log(req.body.CIEgresado);
    console.log(req.body.IDPH);
     console.log(IDCargo);
      console.log(cantidad);
      console.log(req.body.PP);
      console.log(req.body.escalafon);
        console.log("/////////////////////")

con.query("INSERT INTO postulacion (IDPostulacion, CIEgresado, IDPE1, IDCargo1, PartidoPolitico, Escalafon, Fotografia) VALUES ('"+cantidad+"', '"+req.body.CIEgresado+"', '"+req.body.IDPH+"', '"+IDCargo+"', '"+req.body.PP+"', '"+req.body.escalafon+"' , 'ddd');"
  , function (err, result) {
console.log(result);


            if (err){
          throw err;
            res.redirect('/egresado-Postulacion');
            console.log ('agregado existente');

            }

  con.query("INSERT INTO votacion (`IDPE`, `IDPostulacion`, `TotalVotos`) "
  + "VALUES ('"+req.body.IDPH+"', '"+result.IDPostulacion+"', '0');"
  , function (err, result, fields){

                                  });            

             });
        });
    });
  }
  console.log("redireccionado");
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
     

console.log("////////////////entro al post GESTIONAR PROPUESTA/////////// ");
console.log(CI);
console.log(IDP);
console.log(IDPE);
console.log(propu);

con.query("INSERT INTO propuestacampana (Postulacion_IDPostulacion,prpuesta) VALUES ('"+IDP+"', '"+propu+"');", function (err, result) {
console.log(result);

 });

    }



    
    console.log("redireccionado");
    res.redirect('/egresado-propuestas');

});


//******************************************************************//
              //GET RUTA PARA ELIMINAR POSTULACION//
//******************************************************************//

app.get('/egresados-RetirarPropuesta', requireLogin, function(req, res) {
sess = req.session;

 con.query("  select c.NombreCargo,c.IDCargo "
            +" FROM cargo AS c "
            +" WHERE c.IDCargo  in "
            +" (SELECT c.IDCargo FROM cargo as c," 
            +" postulacion as post,usuario as u, egresado as egr,periodoelectoral as PE "
            +" WHERE post.CIEgresado =egr.CI AND egr.Usuario_IDUsuario ='"+sess.IDUsuario+"' "
            +" AND post.IDCargo1=c.IDCargo AND c.IDCargo=post.IDCargo1 "
            +" group by c.IDCargo) ", function (err, result, fields){

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

con.query("SELECT c.IDCargo "
  +" FROM cargo as c "
  +" WHERE c.NombreCargo='"+nombreCargo+"';", function (err, result, fields){

    var IDCargo=result[0].IDCargo;

    con.query("SELECT p.IDPostulacion "
      +" FROM postulacion as p, egresado as e, usuario as u"
      +" WHERE p.IDCargo1='"+IDCargo+"' AND p.CIEgresado=e.CI "
      +" AND e.Usuario_IDUsuario=u.IDUsuario AND u.IDUsuario='"+sess.IDUsuario+"';"
  , function (err, result, fields){
    
    var IDPostulacion=result;

con.query(" DELETE FROM `ucabegresados`.`propuestacampana` WHERE Postulacion_IDPostulacion='"+IDPostulacion+"';"
  , function (err, result, fields){

                                  });

con.query(" DELETE FROM votacion WHERE Postulacion_IDPostulacion='"+IDPostulacion+"';"
  , function (err, result, fields){

                                  });

  con.query(" DELETE FROM postulacion WHERE IDPostulacion='"+IDPostulacion+"';"
  , function (err, result, fields){

                                  });
console.log("redireccionado");
    res.redirect('/egresado-Postulacion');

                                });

                     });
          }

});

//******************************************************************//
              //GET RUTA PARA  VOTACION//
//******************************************************************//

app.get('/egresado-InicioVotacion', requireLogin, function(req, res) {
sess = req.session;

res.render('egresado-InicioVotacion',{SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuari});

   
   
});




//******************************************************************//
              //GET RUTA PARA INICIAR VOTACION//
//******************************************************************//

app.get('/egresado-IVotacion', requireLogin, function(req, res) {
sess = req.session;


con.query(" SELECT p.IDCargo1,c.NombreCargo "
  +" FROM postulacion as p,cargo as c "
  +" WHERE p.IDcargo1=c.IDCargo "
  +" group by p.IDCArgo1;"
  , function (err, result, fields){

var cargos=result;
con.query("select concat_ws(' ',e.NombreEgresado, E.ApellidoEgresado) as nombre,p.IDCargo1 "
  +" FROM egresado as e, postulacion as p "
  +" WHERE e.CI=p.CIEgresado "
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

app.post('/egresado-Votacion', function(req, res) {


    if( req.body.InicioVotacion == 'Iniciar' ){
console.log("////////////////entro al post INICIAR VOTACIÓN/////////// ");



console.log("////////////////////////////");
console.log("redireccionado");
    res.redirect('/egresado-IVotacion');
} // if iniciar




    

    if(req.body.InicioVotacion == 'votar'){

      var vo=req.body.cargos_seleccionados;
 console.log("casillas seleccionadas");
    for ( i=0, len=vo.length ; i<len-1; i++) 
    {
  console.log(vo[i]);

    }
} // if votar



    
  

});

//******************************************************************//
              //GET RUTA PARA  RESULTADOS//
//******************************************************************//

app.get('/egresados-Resultados', requireLogin, function(req, res) {
sess = req.session;

//query que devuelve los resultados de las elecciones y los ordena por cargo de forma descendete
con.query("SELECT c.IDCargo,c.NombreCargo, concat_ws(' ',e.NombreEgresado,e.ApellidoEgresado) as nombre, p.IDPostulacion,v.TotalVotos "
  +" FROM votacion as v, egresado as e, cargo as c, postulacion as p,usuario as u "
  +" WHERE p.IDPostulacion =v.IDPostulacion "
  +" AND p.IDPE1=v.IDPE "
  +" AND p.CIEgresado =e.CI "
  +" AND c.IDCargo=p.IDcargo1  group by v.TotalVotos desc; "
  , function (err, result, fields){
    GANADOR=result;

con.query(" SELECT p.IDCargo1,c.NombreCargo "
  +" FROM postulacion as p,cargo as c "
  +" WHERE p.IDcargo1=c.IDCargo "
  +" group by p.IDCArgo1;"
  , function (err, result, fields){




res.render('egresados-Resultados-14',{SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuari,GANADOR:GANADOR, cargos:result});

   }); // 2do QUERY
    }); // 1er  query       
}); // GET


//******************************************************************//
              //GET RUTA PARA VER PERFIL//
//******************************************************************//

app.get('/egresados-Perfil', requireLogin, function(req, res) {
sess = req.session;

 con.query("SELECT concat_ws(' ',e.NombreEgresado,e.ApellidoEgresado) as nombre,c.Nombre as NombreC,e.Tlf,e.direccion,e.Email "
  +" FROM egresado as e, carrera as c,usuario as u "
  +" WHERE e.Usuario_IDUsuario=u.IDUsuario "
  +" AND u.IDUsuario='"+sess.IDUsuario+"'", function (err, result, fields){

     res.render('egresados-Perfil',{SideBarList:sess.SBList,
                     IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario,datos:result});

    });
   
});

//******************************************************************//
              //GET RUTA PARA EDITAR PERFIL//
//******************************************************************//

app.get('/egresados-Editar', requireLogin, function(req, res) {
sess = req.session;



con.query("SELECT e.CI,concat_ws(' ',e.NombreEgresado,e.ApellidoEgresado) as nombre,c.Nombre as NombreC,c.IDCarrera "
  +" FROM egresado as e, carrera as c,usuario as u "
  +" WHERE e.Usuario_IDUsuario=u.IDUsuario "
  +" AND u.IDUsuario='"+sess.IDUsuario+"'", function (err, result, fields){

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
console.log("////////////////entro al post EDITAR PERFIL/////////// ");

var tlf=req.body.Telefono;
var Email=req.body.Email;
var Dirección=req.body.Dirección;
var CI=req.body.CI;
var IDCarrera=req.body.IDCarrera;
console.log(tlf);
console.log(Email);
console.log(Dirección);
console.log(CI);
console.log(IDCarrera);

con.query("UPDATE `ucabegresados`.`egresado` SET `Tlf`='"+tlf+"', "
  +" `Email`='"+Email+"', `direccion`='"+Dirección+"'"
  +" WHERE `CI`='"+CI+"' and`Usuario_IDUsuario`='"+sess.IDUsuario
  +"' and `Carrera_IDCarrera`='"+IDCarrera+"';"
  , function (err, result, fields){
    console.log(result);

console.log("////////////////////////////");
console.log("redireccionado");
    res.redirect('/egresados-Perfil');
 
    
  
});
}// if GUARDAR
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
