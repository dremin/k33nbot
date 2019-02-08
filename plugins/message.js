'use strict';

var client;
var customMessage = '';
var statusMessage = '';

function message(client, options) {
	if (!options.hasOwnProperty("message")) {
		console.log("Message plugin requires the message option to be present.");
		return;
	}
	
	// set messages
	customMessage = options.message;
	statusMessage = options.presence;

	// register message event
	this.onMessage = (message) => {
		message.reply(customMessage);
	}
	
	// register status update event
	this.onPresenceUpdate = () => {
		if (statusMessage) return statusMessage;
	}
	
	return this;
}

module.exports = message;