/*  Información de la tabla Card
	_id:        // 
	idCard:     // 
	codeBus:    // identificador de cada Bus
	idDevice:   // id del Dispositivo
	timeDevice: // Hora del ardino
	timestamp:  // 
*/

'use strict'

//modulos
var fs = require('fs');
var path = require('path');

// para ejecutar el app en la consola ejecutar: > npm start
//modelos
var User=require('../models/user');
var Card = require('../models/card');

//acciones
function pruebas(req,res){
	res.status(200).send({
		menssage: 'Probando el controlador de cardes y la accion pruebas',
		user:req.user
	});
}

function saveCard(req,res){

	//Crear objeto de card
	var card= new Card();

	//Recoger parametros peticion
	var params = req.body;

	if(params.idCard && params.codeBus && params.idDevice && params.timeDevice && params.timestamp ){

		card.idCard=params.idCard;
		card.codeBus=params.codeBus;
		card.idDevice=params.idDevice;
		card.timeDevice=params.timeDevice;
		card.timestamp=params.timestamp;	

		card.save((err,cardStored)=>{
			if (err) {
				res.status(500).send({menssage: 'Error en el servidor'});
			}else{
				if (!cardStored) {
					res.status(404).send({menssage: 'No se ha guardado el card'});
				}else{
					res.status(200).send({card:cardStored});
				}
			}
		});
	}else{
		res.status(200).send({menssage: 'Todos los campos son obligatorios'});
	}
}


function getCards(req,res){
	Card.find({}).populate({path: 'card'}).exec((err,cards)=>{
		if (err) {
			res.status(500).send({menssage: 'Error en la petición'});
		}else{

			if (!cards) {
				res.status(404).send({menssage: 'No hay cardes'});
			}else{
				res.status(200).send({cards});
			}			
		}
	})
}

function getCard(req,res){
	var cardId=req.params.id;

	Card.findById(cardId).populate({path:'card'}).exec((err,card)=>{
		if (err) {
			res.status(500).send({menssage: 'Error en la petición'});
		}else{
			if (!card) {
				res.status(404).send({menssage: 'El card no existe'});
			}else{
				res.status(200).send({card});
			}			
		}
	});
}

function updateCard(req,res){
	var cardId = req.params.id;
	var update=req.body;

	Card.findByIdAndUpdate(cardId, update, {new:true}, (err,cardUpdate)=>{
		if (err) {
			res.status(500).send({menssage: 'Error en la petición'});
		}else{
			if (!cardUpdate) {
				res.status(404).send({menssage: 'No se pudo actualizar el card'});
			}else{
				res.status(200).send({card:cardUpdate});
			}			
		}
	});
}

function deleteCard(req,res){
	var cardId=req.params.id;
	Card.findByIdAndRemove(cardId,(err,cardRemoved)=>{
		if (err) {
			res.status(500).send({menssage: 'Error en la petición'});
		}else{
			if (!cardRemoved) {
				res.status(404).send({menssage: 'No se pudo borrar el card'});
			}else{
				res.status(200).send({card: cardRemoved});
			}
		}
	});
}


module.exports={
	pruebas,
	saveCard,
	getCards,
	getCard,
	updateCard,
	deleteCard
}