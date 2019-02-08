'use strict';

const discord = require('discord.js');
const config = require('../common/config').config;

function DiscordClient(bot) {
	
	this.client = new discord.Client();

	this.client.on('ready', () => {
		if (config.debug) console.log(`${this.client.user.tag} logged in`);
		setPresence(this.client, bot);
	});
	
	this.client.on('guildMemberAdd', member => {
		
		for (var action in bot.actions) {
			if (typeof bot.actions[action].plugin.onNewUser == 'function') {
					
				if (config.debug) console.log(`${this.client.user.tag} executing new user action plugin`);
				
				bot.actions[action].plugin.onNewUser(member);
				
			}
		}
		
	});
	
	this.client.on('message', message => {
		
		for (var action in bot.actions) {
			if (message.content.startsWith(bot.actionPrefix + bot.actions[action].command)) {
				if (typeof bot.actions[action].plugin.onMessage == 'function') {
					
					if (config.debug) console.log(`${this.client.user.tag} executing message action plugin for message: ${message.content}`);
					
					bot.actions[action].plugin.onMessage(message);
					
				}
			}
		}
		
	});


	this.client.login(bot.token);
	
	
	
	// export functions
	this.updatePresence = setPresence;



	return this;
}

function setPresence(client, bot) {
	if (client.user) {
		client.user.setActivity(getPresenceText(client, bot), { type: 'PLAYING' }).then(() => {
			if (config.debug) console.log(`${client.user.tag} presence updated`);
		}).catch(() => {
			if (config.debug) console.log(`${client.user.tag} presence update failed`);
			});
	}
}

function getPresenceText(client, bot) {
	var presence = '';
	
	for (var action in bot.actions) {
		if (typeof bot.actions[action].plugin.onPresenceUpdate == 'function') {
				
			if (config.debug) console.log(`${client.user.tag} executing presence update plugin`);
			
			var pluginPresence = bot.actions[action].plugin.onPresenceUpdate();
			
			if (action > 0 && pluginPresence) pluginPresence = " | " + pluginPresence;
			
			if (pluginPresence) presence += pluginPresence;
			
		}
	}
	
	return presence;
}

module.exports = DiscordClient;