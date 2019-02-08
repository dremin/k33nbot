'use strict';

const url = 'https://servers-live.fivem.net/api/servers/single/';
const config = require('../common/config').config;
const request = require('../common/jsonRequest');
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
	request(url + server).then((data) => {
		sendOnlineStatus(data, message);
	},
	(reason) => {
		sendOfflineStatus(message);
	});
}

function sendOnlineStatus(data, message) {
	if (!(data.hasOwnProperty("Data") && data.Data.hasOwnProperty("hostname") && data.Data.hasOwnProperty("clients") && data.Data.hasOwnProperty("svMaxclients") && Date.now() - Date.parse(data.Data.lastSeen) < 600000)) {
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