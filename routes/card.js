'use strict'

var express=require('express');
var CardController=require('../controllers/card');

var api = express.Router();

var multipart = require('connect-multiparty');


api.get('/pruebas-cards', CardController.pruebas);

api.post('/card', CardController.saveCard);

api.get('/cards', CardController.getCards);
api.get('/card/:id', CardController.getCard);

api.put('/card/:id', CardController.updateCard);

api.delete('/card/:id', CardController.deleteCard);

module.exports = api;

//  localhost:pp/api/cards
