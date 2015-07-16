var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addWebsiteSchema = new Schema(
{
	name: { type: String, required: 'Please enter a name' },
	url: { type: String, required: 'Please enter an URL' },
	pollInterval: { type: Number, min:[1, 'Not a valid input'] },
	isAlert: Boolean,
	mailID: String,
	mobileNumber: String,
	mobileProvider: String,
	addedTime: {type : Date, default: Date.now},
	isUp: String,
	statusCode: Number,
	responseTime: Number
});

module.exports = mongoose.model('Websites', addWebsiteSchema);