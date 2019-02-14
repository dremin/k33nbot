'use strict';

function Message(bot, options) {
	if (!options.hasOwnProperty("message")) {
		console.log("Message plugin requires the message option to be present.");
		return;
	}
	
	this.statusMessage;
	this.messageContent;
	
	// set status message
	if (options.hasOwnProperty("presence")) this.statusMessage = options.presence;
	
	// set embed if enabled
	if (options.hasOwnProperty("useEmbed") && options.useEmbed) {
		this.messageContent = {content: options.message, embed: { color: 0x520074, title: options.message }};
	} else {
		this.messageContent = options.message;
	}

	// register message event
	this.onMessage = (message) => {
		message.channel.send(this.messageContent);
	}
	
	// register status update event
	this.onPresenceUpdate = () => {
		if (this.statusMessage) return this.statusMessage;
	}
	
	return this;
}

module.exports = Message;