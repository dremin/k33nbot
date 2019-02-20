'use strict';

function Bot(botConfig) {
	if (!(botConfig.hasOwnProperty("actions") && botConfig.hasOwnProperty("type"))) {
		console.log("Incomplete bot configuration.");
		return this;
	}
	
	this.type;
	this.actions = [];
	this.botConfig = botConfig;
	
	// set default presence if present
	if (botConfig.hasOwnProperty("defaultPresence")) this.defaultPresence = botConfig.defaultPresence;
	
	// set type, which will initialize client
	this.type = new (require(`../clients/${botConfig.type}`))(this);
	
	// initialize actions, which will initialize plugin
	for (var action in botConfig.actions) {
		this.actions.push(new (require('./action'))(this, botConfig.actions[action]));
	}
	
	return this;
}

module.exports = Bot;