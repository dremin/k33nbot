'use strict';

const config = require('../common/config');

function Admin(bot, options) {
	if (!options.hasOwnProperty("allowedRole")) {
		console.log("Admin plugin requires the allowedRole option to be present.");
		return;
	}
	
	this.allowedRole = options.allowedRole;

	// register message event
	this.onMessage = (message) => {
		this.handleMessage(message);
	}
	
	return this;
}

Admin.prototype.handleMessage = function(message) {
	var commandBits = message.content.split(' ');
	var reply = '';
	var deferCommit = false;
	
	if (message.member && message.member.roles.some(role => role.name === this.allowedRole)) {	
		switch (commandBits[1]) {
			case 'view':
				reply = this.viewConfig(commandBits);
				break;
			case 'set':
				reply = this.setConfig(message.content);
				break;
			case 'addArray':
				reply = this.addConfig(commandBits, true);
				break;
			case 'addObject':
				reply = this.addConfig(commandBits, false);
				break;
			case 'delete':
				reply = this.deleteConfig(commandBits);
				break;
			case 'save':
				reply = 'Configuration saved! Reloading.';
				deferCommit = true;
				break;
			default:
				reply = '**Possible admin commands**:\nview _setting_\nset _setting_\naddArray _setting_\naddObject _setting_\ndelete _setting_\nsave';
		}
	} else {
		// user not in allowed role
		reply = 'Sorry, you are not allowed to use this feature.'
	}
	
	// send message
	message.author.send(reply).then((msg) => {
		if (deferCommit) {
			config.commit();
		}
	});
}

Admin.prototype.viewConfig = function(commandBits) {
	// get bits for config path as everything after view
	var pathBits = commandBits.slice(2, commandBits.length);
	
	if (pathBits.length < 1) {
		return `Specify a configuration to view. Try \`${commandBits[0]} view bots\``;
	}
	
	// traverse the config to get the given config object
	var configObj = this.traversePath(config.config, pathBits);
	
	if (configObj === null) {
		return `Invalid setting path. Try \`${commandBits[0]} view bots\``;
	}
	
	// the name of the last node
	var nodeName = pathBits[pathBits.length - 1];
	
	if (configObj && configObj.constructor === Array) {
		var reply = `**List of ${nodeName}**`;
		// display list of options
		for (var item in configObj) {
			reply += '\n' + item + ': ';
			
			switch (nodeName) {
				case 'bots':
					reply += `type: _${configObj[item].type}_; token: \`${configObj[item].options.token}\``;
					break;
				case 'actions':
					reply += `plugin: _${configObj[item].plugin}_; command: _${configObj[item].command}_`;
					break;
				default:
					reply += `${configObj[item]}`;
			}
		}
		
		if (configObj.length > 0) {
			var joinedPath = commandBits.join(' ');
			reply += `\n\nTry \`${joinedPath} 0\``;
		}
		
		return reply;
	}
	
	return '```' + JSON.stringify(configObj, null, "\t") + '```';
}

Admin.prototype.addConfig = function(commandBits, isArray) {
	// get bits for config path as everything after view
	var pathBits = commandBits.slice(2, commandBits.length - 1);
	
	if (pathBits.length < 1) {
		return `Specify a configuration to create.`;
	}
	
	// traverse the config to get the given config object
	var configObj = this.traversePath(config.config, pathBits);
	
	// the target property to change
	var target = commandBits[commandBits.length - 1];
	
	if (configObj !== null && !configObj[target]) {
		if (isArray) {
			configObj[target] = [];
		} else {
			configObj[target] = {};
		}
		return 'Setting object created.';
	} else {
		return `Invalid setting path. Try \`${commandBits[0]} view\``;
	}
}

Admin.prototype.deleteConfig = function(commandBits) {
	// get bits for config path as everything after view
	var pathBits = commandBits.slice(2, commandBits.length - 1);
	
	if (pathBits.length < 1) {
		return `Specify a configuration to delete. Try \`${commandBits[0]} view\``;
	}
	
	// traverse the config to get the given config object
	var configObj = this.traversePath(config.config, pathBits);
	
	// the target property to change
	var target = commandBits[commandBits.length - 1];
	
	if (configObj !== null && configObj[target] !== null) {
		delete configObj[target];
		return 'Setting deleted.';
	} else {
		return `Invalid setting path. Try \`${commandBits[0]} view\``;
	}
}

Admin.prototype.setConfig = function(messageContent) {
	// get bits for command as everything to the left of =
	var commandBits = messageContent.slice(0, messageContent.indexOf('=')).split(' ');
	
	// get bits for config path as everything after set, and before the destination property
	var pathBits = commandBits.slice(2, commandBits.length - 1);
	
	if (pathBits.length < 1) {
		return `Specify a configuration to set. Try \`${commandBits[0]} view\``;
	}
	
	// traverse the config to get the given config object
	var configObj = this.traversePath(config.config, pathBits);
	
	// the target property to change
	var target = commandBits[commandBits.length - 1];
	
	// the value to set the target property to
	var setting = messageContent.slice(messageContent.indexOf('=') + 1, messageContent.length);
	
	if (configObj !== null && configObj[target] !== null) {
		configObj[target] = setting;
		return 'Setting changed.';
	} else {
		return `Invalid setting path. Try \`${commandBits[0]} view\``;
	}
}

Admin.prototype.traversePath = function(obj, pathBits) {
	// recursive function to walk the config path given user input. returns the object representing the last item in the path.
	if (obj[pathBits[0]]) {
		
		if (pathBits.length <= 1) {
			return obj[pathBits[0]];
		} else {
			return this.traversePath(obj[pathBits[0]], pathBits.slice(1, pathBits.length));
		}
	} else {
		return null;
	}
}

module.exports = Admin;