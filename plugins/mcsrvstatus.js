'use strict';

const url = 'https://api.mcsrvstat.us/1/';
const request = require('../common/jsonRequest');
const fetchTimeMs = 900000;
var server = '0.0.0.0:0';
var message = '';
var name = 'mcsrvstat.us';
var presence = '';

function Mcsrvstatus(bot, options) {
	if (!options.hasOwnProperty("server")) {
		console.log("mcsrvstat.us plugin requires the server option to be present.");
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
	if (!(data.hasOwnProperty("ip") && data.hasOwnProperty("port") && (data.hasOwnProperty("motd") && data.motd.hasOwnProperty("raw")) && (data.hasOwnProperty("players") && data.players.hasOwnProperty("online") && data.players.hasOwnProperty("max")))) {
		setOfflineStatus();
		return;
	}
	
	message = `**Server Online**\`\`\`${data.motd.raw}
IP: ${data.ip}:${data.port}

Players: ${data.players.online} / ${data.players.max}\`\`\``;
	presence = `${name}: ${data.players.online} / ${data.players.max}`;
}

function setOfflineStatus() {
	message = `**Server Offline**`;
	presence = `${name}: Offline`;
}

module.exports = Mcsrvstatus;