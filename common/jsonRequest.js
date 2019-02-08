'use strict';

const config = require('./config').config;
const request = require('request');

function makeRequest(url) {
	return new Promise((resolve, reject) => {
		if (config.debug) console.log('Making request to: ', url);
		request.get({
			url: url,
			json: true
			}, (err, res, data) => {
				if (err) {
					if (config.debug) console.log('Error making request: ', err);
					reject('error');
				} else if (res.statusCode !== 200) {
					if (config.debug) console.log('Unexpected status code: ', res.statusCode);
					reject('status');
				} else {
					resolve(data);
				}
		});
	});
}

module.exports = makeRequest;