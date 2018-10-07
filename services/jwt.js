'use strict'

// genera un 
var jwt = require('jwt-simple');

//Permite generar un timestamp, fecha
var moment = require('moment');

var secret = 'clave_secreta_del_curso_de_angular';

/*

 payload: objeto con el cual queremos generar el token
 @sub: propiedad que identifica al id del usuario
 @iat: define el tiempo actual en formato unix(timestamp)
 @exp: fecha de expiracion del token

*/
exports.createToken = function(user){
	var payload = {
		sub:user._id,
		name:user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),
		exp:moment().add(30,'days').unix
	};

	return jwt.encode(payload,secret);
}