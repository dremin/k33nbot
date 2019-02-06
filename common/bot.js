'use strict';

const config = require('./config').config;

function bot(botConfig) {
	this.type;
	this.actions = [];
	
	// set action prefix
	this.actionPrefix = botConfig.actionPrefix;
	
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

module.exports = bot;