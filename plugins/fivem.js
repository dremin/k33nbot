'use strict';

const url = 'https://servers-live.fivem.net/api/servers/single/';
const config = require('../common/config').config;
const request = require('request');
var server = '0.0.0.0:0';

function fivem(client, options) {
	
	// set server id
	server = options.server;

	// register message event
	this.onMessage = (message) => {
		getStatus(message);
	}
	
}

function getStatus(message) {
	request.get({
		url: url + server,
		json: true
		}, (err, res, data) => {
			if (err) {
				console.log('Error making FiveM request: ', err);
				sendOfflineStatus(message);
			} else if (res.statusCode !== 200) {
				console.log('Unexpected status code from FiveM: ', res.statusCode);
				sendOfflineStatus(message);
			} else {
				// data is already parsed as JSON:
				sendOnlineStatus(data, message);
			}
	});
}

function sendOnlineStatus(data, message) {
	if (Date.now() - Date.parse(data.Data.lastSeen) > 600000) {
		sendOfflineStatus(message);
		return;
	}
	
	message.reply(`**Server Online**\`\`\`${data.Data.hostname}

Players: ${data.Data.clients} / ${data.Data.svMaxclients}\`\`\``);
}

function sendOfflineStatus(message) {
	message.reply(`**Server Offline**`);
}

module.exports = fivem;