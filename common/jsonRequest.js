'use strict';

const config = require('./config').config;
const request = require('request');
var cache = [];

function makeRequest(url, cacheTimeoutMs) {
	var useCache = false;
	var cacheItem;
	var now = Date.now();
	
	// perform cache logic
	if (!(cacheTimeoutMs === undefined)) {
		useCache = true;
		
		// iterate cache
		var i = cache.length
		while (i--) {
			if (cache[i].url === url) {
				// cache hit, use if not expired, otherwise purge
				
				if (Date.now() >= cache[i].expiration) {
					// cached item has expired
					
					if (config.debug) console.log(`Removing expired cache for URL ${url}`);
					cache.splice(i, 1);
				} else {
					// use this cached item
					
					if (cache[i].inFlight) {
						if (config.debug) console.log(`Using existing in-flight request for URL ${url}`);
						return cache[i].promise;
					}
					
					return new Promise((resolve, reject) => {
						if (cache[i].error) {
							if (config.debug) console.log(`Using cached error response for URL ${url}`);
							reject('error');
						} else {
							if (config.debug) console.log(`Using cached response for URL ${url}`);
							resolve(cache[i].data);
						}
					})
				}
			}
		}
	}
	
	// perform request
	var promise = new Promise((resolve, reject) => {
		if (config.debug) console.log(`Making request to ${url}`);
		
		request.get({
			url: url,
			json: true
			}, (err, res, data) => {
				if (err) {
					if (config.debug) console.log(`Error making request: ${err}`);
					
					if (useCache) {
						cacheItem.error = true;
						cacheItem.inFlight = false;
						if (config.debug) console.log(`Saved error response to cache.`);
					}
					
					reject('error');
				} else if (res.statusCode !== 200) {
					if (config.debug) console.log(`Unexpected status code: ${res.statusCode}`);
					
					if (useCache) {
						cacheItem.error = true;
						cacheItem.inFlight = false;
						if (config.debug) console.log(`Saved error response to cache.`);
					}
					
					reject('status');
				} else {
					
					if (useCache) {
						cacheItem.data = data;
						cacheItem.inFlight = false;
						if (config.debug) console.log(`Saved response to cache.`);
					}
					
					resolve(data);
				}
		});
	});
		
	// if using cache, add this url to the cache array now, so that subsequent requests to this URL before the first response is received wait for it instead of making another request.
	if (useCache) {
		cacheItem = {
			url: url,
			expiration: now + cacheTimeoutMs,
			inFlight: true,
			error: false,
			promise: promise
		};
		cache.push(cacheItem);
	}
	
	return promise;
}

module.exports = makeRequest;