var Monitor = require('../models/pings')
var Ping = require('../models/pings');
var socketMVC = require('socket.mvc');

//returns everything
module.exports.list = function(req, res) {
    Monitor.find({}, function(err, results) {
        res.json(results);
    });
}

//returns rows that satisfies the query
module.exports.find = function(req, res) {
    Monitor.find(req.params, function(err, results) {
        res.json(results);
    });
}