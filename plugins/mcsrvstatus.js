'use strict';

const url = 'https://api.mcsrvstat.us/1/';
const config = require('../common/config').config;
const request = require('../common/jsonRequest');
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
	request(url + server).then((data) => {
		sendOnlineStatus(data, message);
	},
	(reason) => {
		sendOfflineStatus(message);
	});
}

function sendOnlineStatus(data, message) {
	if (!(data.hasOwnProperty("ip") && data.hasOwnProperty("port") && (data.hasOwnProperty("motd") && data.motd.hasOwnProperty("raw")) && (data.hasOwnProperty("players") && data.players.hasOwnProperty("online") && data.players.hasOwnProperty("max")))) {
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