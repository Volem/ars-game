'use strict';

const mongoose = require('mongoose');
try {
	if (!mongoose.connection.readyState) {
		mongoose.Promise = require('bluebird');
		mongoose.connect(process.env.mongodbconnection, {
			socketTimeoutMS: 30000,
			connectTimeoutMS: 30000,
			keepAlive: 1000,
			useMongoClient: true
		}, function (err) {
			if (err) {
				console.log(err);
			} else {
				console.log('Connected to MongoDB.');
			}
		});
	} else {
		console.log('MongoDB connection is established already. No need to reconnect.');
	}
} catch (ex) {
	console.log('Connection Exception : ' + ex.message);
}