'use strict';

function Action(bot, actionConfig) {
	if (!actionConfig.hasOwnProperty("plugin")) {
		console.log("Incomplete action configuration.");
		return this;
	}
	
	this.hideFromHelp = false;
	
	// set invocation command
	if (actionConfig.hasOwnProperty("command")) this.command = actionConfig.command;
	
	// set help hidden property
	if (actionConfig.hasOwnProperty("hideFromHelp")) this.hideFromHelp = actionConfig.hideFromHelp;
	
	// set plugin, init with options
	this.plugin = new (require(`../plugins/${actionConfig.plugin}`))(bot, actionConfig.options);
	
	return this;
}

module.exports = Action;