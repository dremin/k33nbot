'use strict';

const url = 'https://api.battlemetrics.com/servers/';
const config = require('../common/config').config;
const request = require('../common/jsonRequest');
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
	request(url + serverId).then((data) => {
		sendOnlineStatus(data, message);
	},
	(reason) => {
		sendOfflineStatus(message);
	});
}

function sendOnlineStatus(data, message) {
	if (!(data.hasOwnProperty("data") && data.data.hasOwnProperty("attributes") && data.data.attributes.hasOwnProperty("name") && data.data.attributes.hasOwnProperty("ip") && data.data.attributes.hasOwnProperty("port") && (data.data.attributes.hasOwnProperty("details") && data.data.attributes.details.hasOwnProperty("map") && data.data.attributes.details.hasOwnProperty("rust_world_seed") && data.data.attributes.details.hasOwnProperty("rust_world_size") && data.data.attributes.details.hasOwnProperty("rust_fps") && data.data.attributes.details.hasOwnProperty("rust_fps_avg")) && data.data.attributes.hasOwnProperty("players") && data.data.attributes.hasOwnProperty("maxPlayers") && data.data.attributes.status == "online")) {
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