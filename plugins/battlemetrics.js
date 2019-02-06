'use strict';

const url = 'https://api.battlemetrics.com/servers/';
const config = require('../common/config').config;
const request = require('request');
var serverId = '0';

function battlemetrics(client, options) {
	
	// set server id
	serverId = options.serverId;

	// register message event
	this.onMessage = (message) => {
		getStatus(message);
	}
	
}

function getStatus(message) {
	request.get({
		url: url + serverId,
		json: true
		}, (err, res, data) => {
			if (err) {
				console.log('Error making Battlemetrics request: ', err);
				sendOfflineStatus(message);
			} else if (res.statusCode !== 200) {
				console.log('Unexpected status code from Battlemetrics: ', res.statusCode);
				sendOfflineStatus(message);
			} else {
				// data is already parsed as JSON:
				sendOnlineStatus(data, message);
			}
	});
}

function sendOnlineStatus(data, message) {
	if (data.data.attributes.status != "online") {
		sendOfflineStatus(message);
		return;
	}
	
	message.reply(`**Server Online**\`\`\`${data.data.attributes.name}
IP: ${data.data.attributes.ip}:${data.data.attributes.port}

Map: ${data.data.attributes.details.map}
Players: ${data.data.attributes.players} / ${data.data.attributes.maxPlayers}

World Seed: ${data.data.attributes.details.rust_world_seed}
World Size: ${data.data.attributes.details.rust_world_size}

FPS: ${data.data.attributes.details.rust_fps}
Avg FPS: ${data.data.attributes.details.rust_fps_avg}\`\`\``);
}

function sendOfflineStatus(message) {
	message.reply(`**Server Offline**`);
}

module.exports = battlemetrics;