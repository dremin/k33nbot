'use strict';

const url = 'https://api.mcsrvstat.us/1/';
const request = require('../common/jsonRequest');
const fetchTimeMs = 900000;

function Mcsrvstatus(bot, options) {
	this.embed = {};
	this.message = '';
	this.name = 'mcsrvstat.us';
	this.presence = '';
	this.thumbnail = '';
	this.image = '';
	
	if (!options.hasOwnProperty("server")) {
		console.log("mcsrvstat.us plugin requires the server option to be present.");
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
	
	// dispose of timer
	this.dispose = () => {
		clearInterval(fetchLoop)
	}
	
	return this;
}

Mcsrvstatus.prototype.setStatus = function(bot) {
	request(url + this.server, fetchTimeMs).then((data) => {
		this.setOnlineStatus(data);
		bot.type.updatePresence();
	},
	(reason) => {
		this.setOfflineStatus();
		bot.type.updatePresence();
	});
}

Mcsrvstatus.prototype.setOnlineStatus = function(data) {
	if (!(data.hasOwnProperty("ip") && data.hasOwnProperty("port") && (data.hasOwnProperty("motd") && data.motd.hasOwnProperty("raw")) && (data.hasOwnProperty("players") && data.players.hasOwnProperty("online") && data.players.hasOwnProperty("max")))) {
		this.setOfflineStatus();
		return;
	}
	
	this.message = `**Server Online**\`\`\`${data.motd.raw}
IP: ${data.ip}:${data.port}

Players: ${data.players.online} / ${data.players.max}\`\`\``;

	this.embed = {
		color: 0x12c000,
		title: `${data.motd.raw}`,
		description: `IP: ${data.ip}:${data.port}`,
		thumbnail: {
			url: this.thumbnail
	    },
	    image: {
		    url: this.image
	    },
		fields: [{
			name: "Players",
			value: `${data.players.online} / ${data.players.max}`
		}]
	};
	
	this.presence = `${this.name}: ${data.players.online} / ${data.players.max}`;
}

Mcsrvstatus.prototype.setOfflineStatus = function() {
	this.message = `**Server Offline**`;
	this.embed = {
		color: 0x520074,
		title: "Server Offline"
	};
	this.presence = `${this.name}: Offline`;
}

module.exports = Mcsrvstatus;