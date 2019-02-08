'use strict';

var client;
var customMessage = '';

function message(client, options) {
	
	// set message
	customMessage = options.message;

	// register message event
	this.onMessage = (message) => {
		message.reply(customMessage);
	}
	
	return this;
}

module.exports = message;