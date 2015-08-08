var Monitor = require('../models/pings')

module.exports.list = function(req, res) {
    Monitor.find({}, function(err, results) {
        res.json(results);
    });
}