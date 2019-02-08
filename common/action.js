'use strict';

function Action(bot, actionConfig) {
	if (!(actionConfig.hasOwnProperty("command") && actionConfig.hasOwnProperty("plugin"))) {
		console.log("Incomplete action configuration.");
		return this;
	}
	
	// set invocation command
	this.command = actionConfig.command;
	
	// set plugin, init with options
	this.plugin = new (require(`../plugins/${actionConfig.plugin}`))(bot, actionConfig.options);
	
	return this;
}

module.exports = Action;