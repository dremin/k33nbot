'use strict';

const url = 'https://api.battlemetrics.com/servers/';
const request = require('../common/jsonRequest');
const fetchTimeMs = 900000;

function Battlemetrics(bot, options) {
	this.embed = {};
	this.message = '';
	this.name = 'Battlemetrics';
	this.presence = '';
	this.thumbnail = '';
	this.image = '';
	
	if (!options.hasOwnProperty("serverId")) {
		console.log("Battlemetrics plugin requires the serverId option to be present.");
		return;
	}
	
	// set server id
	this.serverId = options.serverId;
	
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
	
}

Battlemetrics.prototype.setStatus = function(bot) {
	request(url + this.serverId).then((data) => {
		this.setOnlineStatus(data);
		bot.type.updatePresence();
	},
	(reason) => {
		this.setOfflineStatus();
		bot.type.updatePresence();
	});
}

Battlemetrics.prototype.setOnlineStatus = function(data) {
	if (!(data.hasOwnProperty("data") && data.data.hasOwnProperty("attributes") && data.data.attributes.hasOwnProperty("name") && data.data.attributes.hasOwnProperty("ip") && data.data.attributes.hasOwnProperty("port") && (data.data.attributes.hasOwnProperty("details") && data.data.attributes.details.hasOwnProperty("map") && data.data.attributes.details.hasOwnProperty("rust_world_seed") && data.data.attributes.details.hasOwnProperty("rust_world_size") && data.data.attributes.details.hasOwnProperty("rust_fps") && data.data.attributes.details.hasOwnProperty("rust_fps_avg")) && data.data.attributes.hasOwnProperty("players") && data.data.attributes.hasOwnProperty("maxPlayers") && data.data.attributes.status == "online")) {
		this.setOfflineStatus();
		return;
	}
	
	this.message = `**Server Online**\`\`\`${data.data.attributes.name}
IP: ${data.data.attributes.ip}:${data.data.attributes.port}

Players: ${data.data.attributes.players} / ${data.data.attributes.maxPlayers}

Map: ${data.data.attributes.details.map}
Seed: ${data.data.attributes.details.rust_world_seed}
Size: ${data.data.attributes.details.rust_world_size}

Current FPS: ${data.data.attributes.details.rust_fps}
Average FPS: ${data.data.attributes.details.rust_fps_avg}\`\`\``;

	this.embed = {
		color: 0x12c000,
		title: data.data.attributes.name,
		description: `IP: ${data.data.attributes.ip}:${data.data.attributes.port}`,
		thumbnail: {
			url: this.thumbnail
	    },
	    image: {
		    url: this.image
	    },
		fields: [{
			name: "Players",
			value: `${data.data.attributes.players} / ${data.data.attributes.maxPlayers}`
		},
		{
			name: "World",
			value: `Map: ${data.data.attributes.details.map}\nSeed: ${data.data.attributes.details.rust_world_seed}\nSize: ${data.data.attributes.details.rust_world_size}`,
			inline: true
		},
		{
			name: "FPS",
			value: `Current: ${data.data.attributes.details.rust_fps}\nAverage: ${data.data.attributes.details.rust_fps_avg}`,
			inline: true
		}]
	};

	this.presence = `${this.name}: ${data.data.attributes.players} / ${data.data.attributes.maxPlayers}`;
}

Battlemetrics.prototype.setOfflineStatus = function() {
	this.message = `**Server Offline**`;
	this.embed = {
		color: 0x520074,
		title: "Server Offline"
	};
	this.presence = `${this.name}: Offline`;
}

module.exports = Battlemetrics;