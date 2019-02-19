'use strict';

function Greeter(bot, options) {
	if (!options.hasOwnProperty("channel")) {
		console.log("Greeter plugin requires the channel option to be present.");
		return;
	}
	
	this.channel = options.channel;

	// register message event
	this.onNewUser = (member) => {
		this.sendMessage(bot, member);
	}
	
	return this;
}

Greeter.prototype.sendMessage = function(bot, member) {
	var destChannel = bot.type.client.channels.find(channel => channel.name === this.channel);
	
	// return error if no channel returned
	if (!destChannel) {
		console.log(`Greeter could not find channel ${this.channel}.`);
		return;
	}
	
	// return error if not a channel type we can send to
	if (destChannel.type === "voice" || destChannel.type === "category") {
		console.log(`Greeter unable to use channel ${this.channel} due to its type.`);
		return;
	}
	
	var memNum = `${member.guild.memberCount}`;
	
	if (memNum.endsWith('1')) {
		memNum += 'st';
	} else if (memNum.endsWith('2')) {
		memNum += 'nd';
	} else if (memNum.endsWith('3')) {
		memNum += 'rd';
	} else {
		memNum += 'th';
	}
	
	var message = {
		content: `Welcome, ${member}, to ${member.guild.name}! You are the ${memNum} member!`,
		embed: {
			color: 0x520074,
			title: `Welcome, ${member.displayName}, to ${member.guild.name}!`,
			description: `${member} is the ${memNum} member!`,
			timestamp: member.joinedTimestamp,
			footer: {
				icon_url: `https://cdn.discordapp.com/icons/${member.guild.id}/${member.guild.icon}.png?`,
				text: 'Joined'
			},
			thumbnail: {
				url: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=128`
			}
		}
	};
	
	destChannel.send(message);
}

module.exports = Greeter;