'use strict';

function action(bot, actionConfig) {
	
	// set invocation command
	this.command = actionConfig.command;
	
	// set plugin, init with options
	this.plugin = new (require(`../plugins/${actionConfig.plugin}`))(bot.type.client, actionConfig.options);
	
	return this;
}

module.exports = action;