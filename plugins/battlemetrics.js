'use strict';

const url = 'https://api.battlemetrics.com/servers/';
const request = require('../common/jsonRequest');
const fetchTimeMs = 900000;
var serverId = '0';
var message = '';
var name = 'Battlemetrics';
var presence = '';

function Battlemetrics(bot, options) {
	if (!options.hasOwnProperty("serverId")) {
		console.log("Battlemetrics plugin requires the serverId option to be present.");
		return;
	}
	
	// set server id
	serverId = options.serverId;
	
	// set server name
	name = options.name;
	
	// initial fetch
	setStatus(bot);
	
	// start fetch loop
	var fetchLoop = setInterval(() => {
		setStatus(bot);
	}, fetchTimeMs);

	// register message event
	this.onMessage = (msg) => {
		msg.reply(message);
	}
	
	// register status update event
	this.onPresenceUpdate = () => {
		return presence;
	}
	
}

function setStatus(bot) {
	request(url + serverId).then((data) => {
		setOnlineStatus(data);
		bot.type.updatePresence(bot.type.client, bot);
	},
	(reason) => {
		setOfflineStatus();
		bot.type.updatePresence(bot.type.client, bot);
	});
}

function setOnlineStatus(data) {
	if (!(data.hasOwnProperty("data") && data.data.hasOwnProperty("attributes") && data.data.attributes.hasOwnProperty("name") && data.data.attributes.hasOwnProperty("ip") && data.data.attributes.hasOwnProperty("port") && (data.data.attributes.hasOwnProperty("details") && data.data.attributes.details.hasOwnProperty("map") && data.data.attributes.details.hasOwnProperty("rust_world_seed") && data.data.attributes.details.hasOwnProperty("rust_world_size") && data.data.attributes.details.hasOwnProperty("rust_fps") && data.data.attributes.details.hasOwnProperty("rust_fps_avg")) && data.data.attributes.hasOwnProperty("players") && data.data.attributes.hasOwnProperty("maxPlayers") && data.data.attributes.status == "online")) {
		setOfflineStatus();
		return;
	}
	
	message = `**Server Online**\`\`\`${data.data.attributes.name}
IP: ${data.data.attributes.ip}:${data.data.attributes.port}

Map: ${data.data.attributes.details.map}
Players: ${data.data.attributes.players} / ${data.data.attributes.maxPlayers}

World Seed: ${data.data.attributes.details.rust_world_seed}
World Size: ${data.data.attributes.details.rust_world_size}

FPS: ${data.data.attributes.details.rust_fps}
Avg FPS: ${data.data.attributes.details.rust_fps_avg}\`\`\``;
	presence = `${name}: ${data.data.attributes.players} / ${data.data.attributes.maxPlayers}`;
}

function setOfflineStatus() {
	message = `**Server Offline**`;
	presence = `${name}: Offline`;
}

module.exports = Battlemetrics;