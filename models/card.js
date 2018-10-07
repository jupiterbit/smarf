'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardSchema=Schema({
	key: String,
	pin: String,
	serial: String,
	created_at: String
	//user: { type: Schema.ObjectId, ref:'User' }
})

module.exports=mongoose.model('Card',CardSchema);