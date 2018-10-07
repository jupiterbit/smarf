'use strict'

// C:\Program Files\MongoDB\Server\4.0\bin

var express =require('express');

var bodyParser=require('body-parser');

var app = express();

// Cargar rutas
var user_routes=require('./routes/user');
var animal_routes=require('./routes/animal');
var card_routes=require('./routes/card');

// middlewares de body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Configurar cabeceras y cors -> Esto se configura al final despues de haber culminado de implementar el API
// -> Esto sirve para garantizar una buena comunicacion de mi api con los clientes de otros dominios
app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');
	next();
})

//Rutas base
app.use('/api',user_routes);
app.use('/api',animal_routes);
app.use('/api',card_routes);


module.exports = app;