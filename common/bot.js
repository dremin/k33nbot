'use strict';

function Bot(botConfig) {
	if (!(botConfig.hasOwnProperty("actionPrefix") && botConfig.hasOwnProperty("token") && botConfig.hasOwnProperty("actions") && botConfig.hasOwnProperty("type"))) {
		console.log("Incomplete bot configuration.");
		return this;
	}
	
	this.type;
	this.actions = [];
	
	// set action prefix
	this.actionPrefix = botConfig.actionPrefix;
	
	// set default presence if present
	if (botConfig.hasOwnProperty("defaultPresence")) this.defaultPresence = botConfig.defaultPresence;
	
	// set token
	this.token = botConfig.token;
	
	// set type, which will initialize client
	this.type = new (require(`../clients/${botConfig.type}`))(this);
	
	// initialize actions, which will initialize plugin
	for (var action in botConfig.actions) {
		this.actions.push(new (require('./action'))(this, botConfig.actions[action]));
	}
	
	return this;
}

module.exports = Bot;