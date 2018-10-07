'use strict'
var mongoose =require('mongoose');
var app= require('./app');
var port= process.env.PORT || 3789;

mongoose.Promise = global.Promise;

//Conexion a la base de datos Mongo
//mongoose.connect('mongodb://localhost:27017/zoo', { useNewUrlParser: true })

mongoose.connect('mongodb://admin123:admin123@ds157964.mlab.com:57964/mydbjkn', { useNewUrlParser: true })
	.then( ()=>{
		console.log('La conexion a la base de datos se ha realizado correctamente...');
		app.listen(port,()=>{
			console.log("El servidos local con Node y Expres esta corriendo correctamente ...");
		})
	})
	.catch(err => console.log(err));
