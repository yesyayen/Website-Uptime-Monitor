var Monitor = require('../models/pings')
var getDetails = require('../models/websites')

//returns everything
module.exports.list = function(req, res) {
    Monitor.find({}, null, {sort : {time : -1}}, function(err, results) {
        res.json(results);
    });
}

//returns rows that satisfies the query
module.exports.find = function(req, res) {
    Monitor.find(req.params, function(err, results) {
        res.json(results);
    });
}

//returns rows that satisfies the query
module.exports.findWebsite = function(req, res) {
    getDetails.find(req.params, function(err, results) {
        res.json(results);
    });
}