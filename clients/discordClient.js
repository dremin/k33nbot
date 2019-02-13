'use strict';

const discord = require('discord.js');
const config = require('../common/config').config;

function DiscordClient(bot) {
	this.bot = bot;
	this.client = new discord.Client();

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
		
		for (var action in this.bot.actions) {
			if (message.content.startsWith(this.bot.actionPrefix + this.bot.actions[action].command)) {
				if (typeof this.bot.actions[action].plugin.onMessage == 'function') {
					
					if (config.debug) console.log(`${this.client.user.tag} executing message action plugin for message: ${message.content}`);
					
					this.bot.actions[action].plugin.onMessage(message);
					
				}
			}
		}
		
	});


	this.client.login(bot.token);

	return this;
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
	
	for (var action in this.bot.actions) {
		if (typeof this.bot.actions[action].plugin.onPresenceUpdate == 'function') {
				
			if (config.debug) console.log(`${this.client.user.tag} executing presence update plugin`);
			
			var pluginPresence = this.bot.actions[action].plugin.onPresenceUpdate();
			
			if (action > 0 && pluginPresence) pluginPresence = " | " + pluginPresence;
			
			if (pluginPresence) presence += pluginPresence;
			
		}
	}
	
	return presence;
}

module.exports = DiscordClient;