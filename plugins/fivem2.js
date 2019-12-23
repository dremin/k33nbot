'use strict';

const url = '/krp_playercount/';
const request = require('../common/jsonRequest');
const fetchTimeMs = 60000;

function Fivem2(bot, options) {
	this.embed = {};
	this.message = '';
	this.name = 'FiveM';
	this.presence = '';
	this.thumbnail = '';
	this.image = '';
	
	if (!options.hasOwnProperty("server")) {
		console.log("FiveM2 plugin requires the server option to be present.");
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

Fivem2.prototype.setStatus = function(bot) {
	request('http://' + this.server + url, fetchTimeMs).then((data) => {
		this.setOnlineStatus(data);
		bot.type.updatePresence();
	},
	(reason) => {
		this.setOfflineStatus();
		bot.type.updatePresence();
	});
}

Fivem2.prototype.setOnlineStatus = function(data) {
	if (!(data.hasOwnProperty("name") && data.hasOwnProperty("numPlayers") && data.hasOwnProperty("maxPlayers"))) {
		this.setOfflineStatus();
		return;
	}
	
	this.message = `**Server Online**\`\`\`${data.name}

Players: ${data.numPlayers} / ${data.maxPlayers}\`\`\``;

	this.embed = {
		color: 0x12c000,
		title: data.name,
		description: `Direct Connect: ${this.server}`,
		thumbnail: {
			url: this.thumbnail
	    },
	    image: {
		    url: this.image
	    },
		fields: [{
			name: "Players",
			value: `${data.numPlayers} / ${data.maxPlayers}`
		}]
	};
	
	this.presence = `${this.name}: ${data.numPlayers} / ${data.maxPlayers}`;
}

Fivem2.prototype.setOfflineStatus = function() {
	this.message = `**Server Offline**`;
	this.embed = {
		color: 0x520074,
		title: "Server Offline"
	};
	this.presence = `${this.name}: Offline`;
}

module.exports = Fivem2;
