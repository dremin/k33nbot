'use strict';

const discord = require('discord.js');
const config = require('../common/config').config;

function discordClient(bot) {
	
	this.client = new discord.Client();

	this.client.on('ready', () => {
		if (config.debug) console.log(`${this.client.user.tag} logged in`);
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
		if (config.debug) console.log(`${this.client.user.tag} saw: ${message.content}`);
		
		for (var action in bot.actions) {
			if (message.content.startsWith(bot.actionPrefix + bot.actions[action].command)) {
				if (typeof bot.actions[action].plugin.onMessage == 'function') {
					
					if (config.debug) console.log(`${this.client.user.tag} executing message action plugin`);
					
					bot.actions[action].plugin.onMessage(message);
					
				}
			}
		}
		
	});


	this.client.login(bot.token);

	return this;
}

module.exports = discordClient;