var mongoose = require('mongoose');

module.exports = mongoose.model('Websites', {
	name: String,
	url: String
});