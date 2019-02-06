'use strict';

const url = 'https://api.mcsrvstat.us/1/';
const config = require('../common/config').config;
const request = require('request');
var server = '0.0.0.0:0';

function mcsrvstatus(client, options) {
	
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
				console.log('Error making mcsrvstat.us request: ', err);
				sendOfflineStatus(message);
			} else if (res.statusCode !== 200) {
				console.log('Unexpected status code from mcsrvstat.us: ', res.statusCode);
				sendOfflineStatus(message);
			} else {
				// data is already parsed as JSON:
				sendOnlineStatus(data, message);
			}
	});
}

function sendOnlineStatus(data, message) {
	if (!data.hasOwnProperty("ip")) {
		sendOfflineStatus(message);
		return;
	}
	
	message.reply(`**Server Online**\`\`\`${data.motd.raw}
IP: ${data.ip}:${data.port}

Players: ${data.players.online} / ${data.players.max}\`\`\``);
}

function sendOfflineStatus(message) {
	message.reply(`**Server Offline**`);
}

module.exports = mcsrvstatus;