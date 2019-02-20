'use strict';

const discord = require('discord.js');
const config = require('../common/config').config;

function DiscordWebhook(bot) {
	this.bot = bot;
	
	if (!(this.bot.botConfig.hasOwnProperty("options") && this.bot.botConfig.options.hasOwnProperty("webhookUrl"))) {
		console.log("Incomplete bot configuration.");
		return this;
	}
	
	this.configParts = this.bot.botConfig.options.webhookUrl.replace('https://discordapp.com/api/webhooks/', '').split('/');
	
	this.webhook = new discord.WebhookClient(this.configParts[0], this.configParts[1]);
	
	return this;
}

DiscordWebhook.prototype.send = function(message) {
	this.webhook.send(message);
}

DiscordWebhook.prototype.logout = function() {
	for (var action in this.bot.actions) {
		if (typeof this.bot.actions[action].plugin.dispose == 'function') {
			if (config.debug) console.log(`Disposing plugin`);
			this.bot.actions[action].plugin.dispose();
		}
		
		delete this.bot.actions[action];
	}
	
	return this.webhook.destroy();
}

module.exports = DiscordWebhook;