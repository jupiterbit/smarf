'use strict'
//modulos
var bcrypt=require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

//modelos
var User=require('../models/user');

//servicios
var jwt = require('../services/jwt');

//acciones
function pruebas(req,res){
	res.status(200).send({
		menssage: 'Probando el controlador de usuarios y pruebas',
		user:req.user
	});
}

function saveUser(req,res){
	//Crear objeto de usuario
	var user= new User();

	//Recoger parametros peticion
	var params = req.body;
	//console.log(params);

	if(params.password && params.name && params.surname && params.email ){

		user.name=params.name;
		user.surname=params.surname;
		user.email=params.email;
		user.role='ROLE_USER';
		user.image=null;

		User.findOne({email:user.email.toLowerCase()}, (err, issetUser)=>{
			if (err) {
				res.status(500).send({message:"Error al guardar el usuario..."});
			}else{
				if (!issetUser) {
					//ciframos la contraseña
					bcrypt.hash(params.password, null,null, function(err,hash){
						user.password=hash;

						//Guardo usuario en base de datos
						user.save((err,userStored)=>{
							if(err){
								res.status(500).send({message:"Error al guardar el usuario..."});
							}else{
								if (!userStored) {
									res.status(404).send({message:"No se ha registrado el usuario..."});
								}else{
									res.status(200).send({user: userStored});
								}
							}
						});
					});

				}else{
					res.status(200).send({message:"El usuario ya existe..."});
				}
			}
		});		

	}else{
		res.status(200).send({
			menssage: 'Introduce los datos correctamente..'
		});
	}
}

function login(req,res){	
	//Recoger parametros peticion por POST
	var params = req.body;

	//res.status(200).send({message:"Metodo login..."});
	if(params.email && params.password){

		var email= params.email;
		var password= params.password;	

		User.findOne({email:email.toLowerCase()}, (err, user)=>{

			if (err) {
				res.status(500).send({message:"Error al comprobar usuario"}); 
			}else{
				if (user) {
					bcrypt.compare(password,user.password, (err,check)=>{
						if (check) {
							//Comprobar y genenerar el token
							if (params.gettoken) {
								//devolver token jwt
								res.status(200).send({
									token:jwt.createToken(user)
								});

							}else{
								res.status(200).send({user});
							}
						}
						else{
							res.status(404).send({message:"El no ha podido loguearse correctamente"}); // Password inválido
						}
					});					
				}else{					
					res.status(404).send({message:"El no ha podido loguearse"}); // El usuario no existe 
				}
			}
		});
	}

}

function updateUser(req,res){

	var userId = req.params.id; //Captura los parametro enviados por URL
	var update = req.body;

	if (userId != req.user.sub) {
		return res.status(500).send({menssage: 'No tienes permiso para actualizar el usuario'});
	}

	// {new:true} hace que devuelva el objeto actualizado
	User.findByIdAndUpdate(userId,update,{new:true},(err,userUpdated)=>{

		if (err) {
			res.status(500).send({
				menssage: 'Error al atualizar usuario'		
			});
		}else{
			if (!userUpdated) {
				res.status(404).send({
					menssage: 'No se ha podido actualizar el usuario'		
				});
			}else{
				res.status(200).send({user:userUpdated});
			}
		}
	});
}

function uploadImage(req,res){
	var userId = req.params.id;
	var file_name = 'No subido...';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\') ;
		var file_name = file_split[2];

		var exp_split = file_name.split('\.');
		var file_ext = exp_split[1];

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {

			if (userId != req.user.sub) {
				return res.status(500).send({menssage: 'No tienes permiso para actualizar el usuario'});
			}

			User.findByIdAndUpdate(userId,{image: file_name},{new:true},(err,userUpdated)=>{

				if (err) {
					res.status(500).send({
						menssage: 'Error al actualizar usuario'		
					});
				}else{
					if (!userUpdated) {
						res.status(404).send({
							menssage: 'No se ha podido actualizar el usuario'		
						});
					}else{
						res.status(200).send({user: userUpdated, image: file_name});
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
	var path_file =  './uploads/users/'+imageFile;

	fs.exists(path_file,function(exists){
		if (exists) {
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(404).send({menssage: 'La imagen no existe'});
		}
	})
}

function getKeepers(req,res){
	User.find({role:'ROLE_ADMIN'}).exec((err,users)=>{
		if (err) {
			res.status(500).send({menssage: 'Error en la peticion'});
		}else{
			if (!users) {
				res.status(404).send({menssage: 'No hay cuidadores'});
			}else{
				res.status(200).send({users});
			}			
		}
	});	
}

module.exports={
	pruebas,
	saveUser,
	login,
	updateUser,
	uploadImage,
	getImageFile,
	getKeepers
}