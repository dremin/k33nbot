'use strict';
const config = require('./common/config').config;
var bots = [];

if (config.debug) console.log('Starting K33NBot...');

// initialize bots, which will initialize everything else
for (var bot in config.bots) {
	bots.push(new (require('./common/bot'))(config.bots[bot]));
}

if (config.debug) console.log('K33NBot started');