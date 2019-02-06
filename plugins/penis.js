'use strict';

var client;
var penisMessage = 'penis';

function penis(client, options) {
	
	// set message
	penisMessage = options.message;

	// register message event
	this.onMessage = (message) => {
		message.reply(penisMessage);
	}
	
	return this;
}

module.exports = penis;