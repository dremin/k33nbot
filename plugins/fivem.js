'use strict';

const url = 'https://servers-live.fivem.net/api/servers/single/';
const request = require('../common/jsonRequest');
const fetchTimeMs = 600000;
var server = '0.0.0.0:0';
var message = '';
var name = 'FiveM';
var presence = '';

function Fivem(bot, options) {
	if (!options.hasOwnProperty("server")) {
		console.log("FiveM plugin requires the server option to be present.");
		return;
	}
	
	// set server id
	server = options.server;
	
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
	request(url + server).then((data) => {
		setOnlineStatus(data);
		bot.type.updatePresence(bot.type.client, bot);
	},
	(reason) => {
		setOfflineStatus();
		bot.type.updatePresence(bot.type.client, bot);
	});
}

function setOnlineStatus(data) {
	if (!(data.hasOwnProperty("Data") && data.Data.hasOwnProperty("hostname") && data.Data.hasOwnProperty("clients") && data.Data.hasOwnProperty("svMaxclients") && Date.now() - Date.parse(data.Data.lastSeen) <= 600000)) {
		setOfflineStatus();
		return;
	}
	
	message = `**Server Online**\`\`\`${data.Data.hostname}

Players: ${data.Data.clients} / ${data.Data.svMaxclients}\`\`\``;
	presence = `${name}: ${data.Data.clients} / ${data.Data.svMaxclients}`;
}

function setOfflineStatus() {
	message = `**Server Offline**`;
	presence = `${name}: Offline`;
}

module.exports = Fivem;