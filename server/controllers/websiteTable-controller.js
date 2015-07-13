var Monitor = require('../models/websites')

module.exports.list = function(req, res) {
    Monitor.find({}, function(err, results) {
        res.json(results);
    });
}