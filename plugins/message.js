'use strict';

function Message(bot, options) {
	if (!options.hasOwnProperty("message")) {
		console.log("Message plugin requires the message option to be present.");
		return;
	}
	
	this.customMessage = '';
	this.statusMessage;
	
	// set messages
	this.customMessage = options.message;
	if (options.hasOwnProperty("presence")) this.statusMessage = options.presence;

	// register message event
	this.onMessage = (message) => {
		message.reply(this.customMessage);
	}
	
	// register status update event
	this.onPresenceUpdate = () => {
		if (this.statusMessage) return this.statusMessage;
	}
	
	return this;
}

module.exports = Message;