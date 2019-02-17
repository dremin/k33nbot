'use strict';

const fs = require('fs');
const index = require('../index');
const configName = '/k33nbot.json';

exports.config = require(process.env.HOME + configName);

exports.commit = () => {
	// write to disk
	var outputJson = JSON.stringify(exports.config, null, 2);
	fs.writeFile(process.env.HOME + configName, outputJson, 'utf8', (err) => {
		if (err) throw err;
	});
	
	// reload bots
	index.reload();
}