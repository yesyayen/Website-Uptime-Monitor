var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pingSchema = new Schema(
{
	name: String,
	time: {type : Date, default: Date.now},
	websiteID: Schema.Types.ObjectId,
	isUp: String,
	statusCode: Number,
	responseTime: Number,
	isStatusChange: String
});

module.exports = mongoose.model('websitePing', pingSchema);