'use strict'
//modulos
var fs = require('fs');
var path = require('path');
// para ejecutar el app en la consola ejecutar: > npm start
//modelos
var User=require('../models/user');
var Animal = require('../models/animal');

//acciones
function pruebas(req,res){
	res.status(200).send({
		menssage: 'Probando el controlador de animales y la accion pruebas',
		user:req.user
	});
}

/*
	name: String,
	description: String,
	year: Number,
	image: String,
	user: { type: Schema.ObjectId, ref:'User' }
*/

function saveAnimal(req,res){

	//Crear objeto de animal
	var animal= new Animal();

	//Recoger parametros peticion
	var params = req.body;

	if(params.name){

		animal.name=params.name;
		animal.description=params.description;
		animal.year=params.year;
		animal.image=null;
		animal.user=req.user.sub;

		animal.save((err,animalStored)=>{
			if (err) {
				res.status(500).send({menssage: 'Error en el servidor'});
			}else{
				if (!animalStored) {
					res.status(404).send({menssage: 'No se ha guardado el animal'});
				}else{
					res.status(200).send({animal:animalStored});
				}
			}
		});
	}else{
		res.status(200).send({menssage: 'El nombre del animal es obligatorio'});
	}
}


function getAnimals(req,res){
	Animal.find({}).populate({path: 'user'}).exec((err,animals)=>{
		if (err) {
			res.status(500).send({menssage: 'Error en la petición'});
		}else{

			if (!animals) {
				res.status(404).send({menssage: 'No hay animales'});
			}else{
				res.status(200).send({animals});
			}			
		}
	})
}

function getAnimal(req,res){
	var animalId=req.params.id;

	Animal.findById(animalId).populate({path:'user'}).exec((err,animal)=>{
		if (err) {
			res.status(500).send({menssage: 'Error en la petición'});
		}else{
			if (!animal) {
				res.status(404).send({menssage: 'El animal no existe'});
			}else{
				res.status(200).send({animal});
			}			
		}
	});
}

function updateAnimal(req,res){
	var animalId = req.params.id;
	var update=req.body;

	Animal.findByIdAndUpdate(animalId, update, {new:true}, (err,animalUpdate)=>{
		if (err) {
			res.status(500).send({menssage: 'Error en la petición'});
		}else{
			if (!animalUpdate) {
				res.status(404).send({menssage: 'No se pudo actualizar el animal'});
			}else{
				res.status(200).send({animal:animalUpdate});
			}			
		}
	});
}

function uploadImage(req,res){
	var animalId = req.params.id;
	var file_name = 'No subido...';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\') ;
		var file_name = file_split[2];

		var exp_split = file_name.split('\.');
		var file_ext = exp_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {			


			Animal.findByIdAndUpdate(animalId,{image: file_name},{new:true},(err,animalUpdated)=>{

				if (err) {
					res.status(500).send({
						menssage: 'Error al actualizar animal'		
					});
				}else{
					if (!animalUpdated) {
						res.status(404).send({
							menssage: 'No se ha podido actualizar el animal'		
						});
					}else{
						res.status(200).send({animal: animalUpdated, image: file_name});
					}
				}
			});

		}else{
			fs.unlink(file_path,(err)=>{
				if (err) {
					res.status(200).send({menssage: 'Extension no valida y fichero no borrado'});
				}else{
					res.status(200).send({menssage: 'Extension no valida'});
				}
			});			
		}
		
	}else{
		res.status(200).send({
			menssage: 'No se ha subido archivos'		
		});
	}
}


function getImageFile(req,res){

	var imageFile = req.params.imageFile;
	var path_file =  './uploads/animals/'+imageFile;

	fs.exists(path_file,function(exists){
		if (exists) {
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(404).send({menssage: 'La imagen no existe'});
		}
	})
}

function deleteAnimal(req,res){
	var animalId=req.params.id;
	Animal.findByIdAndRemove(animalId,(err,animalRemoved)=>{
		if (err) {
			res.status(500).send({menssage: 'Error en la petición'});
		}else{
			if (!animalRemoved) {
				res.status(404).send({menssage: 'No se pudo borrar el animal'});
			}else{
				res.status(200).send({animal: animalRemoved});
			}
		}
	});
}


module.exports={
	pruebas,
	saveAnimal,
	getAnimals,
	getAnimal,
	updateAnimal,
	uploadImage,
	getImageFile,
	deleteAnimal
}