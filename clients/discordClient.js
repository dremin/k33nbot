'use strict';

const discord = require('discord.js');
const config = require('../common/config').config;
const helpCmd = 'help';

function DiscordClient(bot) {
	this.bot = bot;
	this.client = new discord.Client();
	
	if (!(this.bot.botConfig.hasOwnProperty("options") && this.bot.botConfig.options.hasOwnProperty("token") && this.bot.botConfig.options.hasOwnProperty("actionPrefix"))) {
		console.log("Incomplete bot configuration.");
		return this;
	}
	
	// set action prefix
	this.actionPrefix = this.bot.botConfig.options.actionPrefix;
	
	// set default presence if present
	if (this.bot.botConfig.options.hasOwnProperty("defaultPresence")) this.defaultPresence = this.bot.botConfig.options.defaultPresence;

	this.client.on('ready', () => {
		if (config.debug) console.log(`${this.client.user.tag} logged in`);
		this.updatePresence();
	});
	
	this.client.on('guildMemberAdd', member => {
		
		for (var action in this.bot.actions) {
			if (typeof this.bot.actions[action].plugin.onNewUser == 'function') {
					
				if (config.debug) console.log(`${this.client.user.tag} executing new user action plugin`);
				
				this.bot.actions[action].plugin.onNewUser(member);
				
			}
		}
		
	});
	
	this.client.on('message', message => {
		// if (config.debug) console.log(`${this.client.user.tag} saw message: ${message.content}`);
		if (message.content.startsWith(this.actionPrefix)) {
			var matches = 0;
			
			for (var action in this.bot.actions) {
				if (message.content.startsWith(this.actionPrefix + this.bot.actions[action].command)) {
					if (typeof this.bot.actions[action].plugin.onMessage == 'function') {
						
						if (config.debug) console.log(`${this.client.user.tag} executing message action plugin for message: ${message.content}`);
						
						this.bot.actions[action].plugin.onMessage(message);
						matches++;
					}
				}
			}
			
			
			// handle help command
			if (message.content === this.actionPrefix + helpCmd) {
				var messageText = this.commandList();
				message.channel.send({content: messageText, embed: { color: 0x520074, title: messageText }});
				matches++;
			}
			
			// handle no match for prefix
			if (matches < 1) {
				var messageText = "Sorry, I didn't quite understand. " + this.commandList();
				message.channel.send({content: messageText, embed: { color: 0x520074, title: messageText }});
			}
		}
	});


	this.client.login(bot.botConfig.options.token);

	return this;
}

DiscordClient.prototype.logout = function() {
	for (var action in this.bot.actions) {
		if (typeof this.bot.actions[action].plugin.dispose == 'function') {
			if (config.debug) console.log(`Disposing plugin`);
			this.bot.actions[action].plugin.dispose();
		}
		
		delete this.bot.actions[action];
	}
	
	return this.client.destroy();
}

DiscordClient.prototype.commandList = function() {
	var helpText = '**Possible commands:**';
	
	for (var action in this.bot.actions) {
		if (this.bot.actions[action].command && !(this.bot.actions[action].hideFromHelp == true || this.bot.actions[action].hideFromHelp == "true")) helpText += '\n' + this.actionPrefix + this.bot.actions[action].command;
	}
	
	return helpText;
}

DiscordClient.prototype.updatePresence = function() {
	if (this.client.user) {
		this.client.user.setActivity(this.getPresenceText(this.bot), { type: 'PLAYING' }).then(() => {
			if (config.debug) console.log(`${this.client.user.tag} presence updated`);
		}).catch(() => {
			if (config.debug) console.log(`${this.client.user.tag} presence update failed`);
			});
	}
}

DiscordClient.prototype.getPresenceText = function() {
	var presence = '';
	
	// get plugin presence
	for (var action in this.bot.actions) {
		if (typeof this.bot.actions[action].plugin.onPresenceUpdate == 'function') {
				
			if (config.debug) console.log(`${this.client.user.tag} executing presence update plugin`);
			
			var pluginPresence = this.bot.actions[action].plugin.onPresenceUpdate();
			
			if (action > 0 && pluginPresence) pluginPresence = " | " + pluginPresence;
			
			if (pluginPresence) presence += pluginPresence;
			
		}
	}
	
	// append default presence
	if (this.defaultPresence && this.defaultPresence.length > 0) {
		if (presence.length > 0) presence += " | ";
		presence += this.defaultPresence;
	}
	
	return presence;
}

module.exports = DiscordClient;