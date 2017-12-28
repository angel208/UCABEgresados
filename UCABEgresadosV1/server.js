var express = require('express');
var session = require('express-session');
var sess;
var app = express();

var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

var bodyParser = require('body-parser');    // pull information from HTML POST (express4)


var mysql = require('mysql');
var conector = require(__dirname +'/connect.js');
var con = conector.conectar();


var comision = require('./routes/comision');
var egresados = require('./routes/egresados');
var director = require('./routes/director');
var administrador = require('./routes/administrador');

//variable que contiene la lista dinamica de candidatos
var SidebarList = ['null'];

app.set('view engine', 'ejs');


app.use(express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(session({secret: 'ssshhhhh', resave: true, saveUninitialized: false}));



app.use(comision);
app.use(egresados);
app.use(director);
app.use(administrador);


//++++++++++++++++++  RUTAS  +++++++++++++++++++++++++++++


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

            //GUARDAR LOS DATOS DE LA SESION. estas variables seran accesibles en todas las rutas luego de iniciar sesion
            sess=req.session;
            sess.IDUsuario = result[0].IDUsuario.toString();
            sess.cargo = result[0].cargo.toString();
            GetSideBar( sess.cargo, sess.IDUsuario );

            con.query("SELECT * FROM periodoelectoral WHERE Estado <> 'X'", function (err, result, field){

                if( !result.length ){
                    sess.PeridoAct = null;
                }
                else{
                    sess.PeridoAct = result[0];

                }

                res.redirect('/index');

            });
        }
    });
});


//aca se redirecciona al usuario a su pagina de inicio
app.get('/index', requireLogin ,function(req, res) {

    sess=req.session;
    sess.SBList = SidebarList;

    con.query("SELECT NombreUsu FROM usuario WHERE IDUsuario = '"+sess.IDUsuario+"' ", function (err, result, fields) {

        sess.NombreUsuario = result[0].NombreUsu;



        switch (sess.cargo){

            case '1': res.render('index_comision', { IDUsuario : sess.IDUsuario, NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList }); break;

            case '3': res.render('index_egresados', { IDUsuario : sess.IDUsuario , NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList }); break;

            case '2': res.render('index_director', { IDUsuario : sess.IDUsuario , NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList });break;

            case '4': res.render('index_admin', { IDUsuario : sess.IDUsuario , NombreUsu : sess.NombreUsuario, SideBarList : sess.SBList });break;

            default: res.redirect('/login'); break;

        }

    });

});

app.get('/logout', requireLogin ,function(req, res) {


    req.session.destroy(function(err) {
        res.redirect("/login");
    })


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


function GetSideBar( cargo, id ) {

    //sidebar de comision (la lista en candidatos muestra las carreras)
    if( cargo == 1 || cargo == 2 ) {

        con.query("SELECT IDCarrera, Nombre  FROM carrera ", function (err, result, fields) {

            if (err) throw err;

            SidebarList = result;

        });

    }
    //Sidebar de egresados (la lista en candidatos muestra los cargos de su carrera)
    if( cargo == 3 ) {

        con.query("SELECT cargo.IDCargo, cargo.NombreCargo FROM usuario, egresado, cargosxcarrera, carrera, cargo, periodoelectoral " +
            "      WHERE usuario.IDUsuario = '"+id+"' " +
            "      AND usuario.IDUsuario = egresado.Usuario_IDUsuario " +
            "      AND egresado.Carrera_IDCarrera = carrera.IDCarrera " +
            "      AND carrera.IDCarrera = cargosxcarrera.Carrera_IDCarrera " +
            "      AND cargosxcarrera.Cargo_IDCargo = cargo.IDCargo " +
            "      AND cargosxcarrera.PeriodoElectoral_IDPE = periodoelectoral.IDPE " +
            "      AND periodoelectoral.Estado <> 'X'", function (err, result, fields) {

            if (err) throw err;

            SidebarList = result;

        });

    }

}

app.listen(8001);
console.log('listening on 8001....');