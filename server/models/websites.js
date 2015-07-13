var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addWebsiteSchema = new Schema(
{
	name: { type: String, required: 'Please enter a name' },
	url: { type: String, required: 'Please enter an URL' },
	pollInterval: { type: Number, min:[1, 'Not a valid input'] },
	mailID: String,
	mobileNumber: String,
	mobileProvider: String,
	addedTime: {type : Date, default: Date.now}
});

module.exports = mongoose.model('Websites', addWebsiteSchema);