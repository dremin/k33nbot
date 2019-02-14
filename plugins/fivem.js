'use strict';

const url = 'https://servers-live.fivem.net/api/servers/single/';
const request = require('../common/jsonRequest');
const fetchTimeMs = 600000;

function Fivem(bot, options) {
	this.embed = {};
	this.message = '';
	this.name = 'FiveM';
	this.presence = '';
	this.thumbnail = '';
	this.image = '';
	
	if (!options.hasOwnProperty("server")) {
		console.log("FiveM plugin requires the server option to be present.");
		return;
	}
	
	// set server id
	this.server = options.server;
	
	// set server name
	if (options.hasOwnProperty("name")) this.name = options.name;
	
	// set graphics
	if (options.hasOwnProperty("thumbnail")) this.thumbnail = options.thumbnail;
	if (options.hasOwnProperty("image")) this.image = options.image;
	
	// initial fetch
	this.setStatus(bot);
	
	// start fetch loop
	var fetchLoop = setInterval(() => {
		this.setStatus(bot);
	}, fetchTimeMs);

	// register message event
	this.onMessage = (msg) => {
		msg.channel.send({content: this.message, embed: this.embed});
	}
	
	// register status update event
	this.onPresenceUpdate = () => {
		return this.presence;
	}
	
	return this;
}

Fivem.prototype.setStatus = function(bot) {
	request(url + this.server, fetchTimeMs).then((data) => {
		this.setOnlineStatus(data);
		bot.type.updatePresence();
	},
	(reason) => {
		this.setOfflineStatus();
		bot.type.updatePresence();
	});
}

Fivem.prototype.setOnlineStatus = function(data) {
	if (!(data.hasOwnProperty("EndPoint") && data.hasOwnProperty("Data") && data.Data.hasOwnProperty("hostname") && data.Data.hasOwnProperty("clients") && data.Data.hasOwnProperty("svMaxclients") && Date.now() - Date.parse(data.Data.lastSeen) <= 600000)) {
		this.setOfflineStatus();
		return;
	}
	
	this.message = `**Server Online**\`\`\`${data.Data.hostname}

Players: ${data.Data.clients} / ${data.Data.svMaxclients}\`\`\``;

	this.embed = {
		color: 0x12c000,
		title: data.Data.hostname,
		description: `IP: ${data.EndPoint}`,
		thumbnail: {
			url: this.thumbnail
	    },
	    image: {
		    url: this.image
	    },
		fields: [{
			name: "Players",
			value: `${data.Data.clients} / ${data.Data.svMaxclients}`
		}]
	};
	
	this.presence = `${this.name}: ${data.Data.clients} / ${data.Data.svMaxclients}`;
}

Fivem.prototype.setOfflineStatus = function() {
	this.message = `**Server Offline**`;
	this.embed = {
		color: 0x520074,
		title: "Server Offline"
	};
	this.presence = `${this.name}: Offline`;
}

module.exports = Fivem;