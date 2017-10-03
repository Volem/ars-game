var bunyan = require('bunyan');

const pad = (n) => (n < 10) ? ('0' + n) : n;

var date = new Date();
var logname = date.getUTCFullYear().toString() + pad(date.getUTCMonth() + 1).toString() + pad(date.getUTCDate()).toString();
module.exports = bunyan.createLogger({
	name:'ars.lb',
	level: 'trace',
	streams: [{
		path: process.env.logLocation + '/' + logname + '.json',
	}]
});