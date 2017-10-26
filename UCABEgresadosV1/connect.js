var mysql = require('mysql');

//Conexion a base de datos
exports.conectar = function () {
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "",
	  database: "ucabegresados",
	  port: 3306 
	});	
	con.connect(function(err) {
	  if (err) throw err;
	  console.log("Conectado a BD");
	});
	return con;

}