'use strict';

function Timer(bot, options) {
	if (!(options.hasOwnProperty("message") && options.hasOwnProperty("interval") && options.hasOwnProperty("channel"))) {
		console.log("Timer plugin requires the channel, message, and interval options to be present.");
		return;
	}
	
	// set properties
	this.message = options.message;
	this.interval = options.interval * 1000; // convert ms to seconds
	this.channel = options.channel;
	
	// start timer
	var timerLoop = setInterval(() => {
		this.sendMessage(bot);
	}, this.interval);
	
	// dispose of timer
	this.dispose = () => {
		clearInterval(timerLoop)
	}
	
	return this;
}

Timer.prototype.sendMessage = function(bot) {
	var destChannel = bot.type.client.channels.find(channel => channel.name === this.channel);
	
	// return error if no channel returned
	if (!destChannel) {
		console.log(`Timer could not find channel ${this.channel}.`);
		return;
	}
	
	// return error if not a channel type we can send to
	if (destChannel.type === "voice" || destChannel.type === "category") {
		console.log(`Timer unable to use channel ${this.channel} due to its type.`);
		return;
	}
	
	destChannel.send(this.message);
}

module.exports = Timer;