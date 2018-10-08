'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardSchema=Schema({
	//_id: mongoose.Types.ObjectId(),
	idCard: { type: String, require: true },
	codeBus: { type: String, require: true },      // identificador de cada Bus
	idDevice: { type: String, require: true },     // id del Dispositivo
	timeDevice: { type: String, require: true },   // Hora del ardino
	timestamp: { type: Date , default: Date.now }
	//user: { type: Schema.ObjectId, ref:'User' }
})

module.exports=mongoose.model('Card',CardSchema);
