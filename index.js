'use strict';
const config = require('./common/config').config;
var bots = [];

if (config.debug) console.log('Starting K33NBot...');

if (!config.hasOwnProperty("bots")) {
	console.log("No bots configuration present.");
	return;
}

// initialize bots, which will initialize everything else
for (var bot in config.bots) {
	bots.push(new (require('./common/bot'))(config.bots[bot]));
}

if (config.debug) console.log('K33NBot running');

exports.reload = () => {
	var promises = [];
	
	for (var bot in bots) {
		promises.push(bots[bot].type.logout());
	}
	
	Promise.all(promises).then(() => {
		bots = [];
	
		// initialize bots, which will initialize everything else
		for (var bot in config.bots) {
			bots.push(new (require('./common/bot'))(config.bots[bot]));
		}
	});
}