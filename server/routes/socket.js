var Monitor   = require('../models/websites');
var Ping = require('../models/pings');
var websiteListController = require('../controllers/websitelist-controller');

var sockets = {};
module.exports = function(socket) {
    //You can declare all of your socket listeners in this file, but it's not required 

    sockets[socket.id] = socket; //appending the socket ID of the client to the array

    socket.on('createNote', function(data) {
        console.log(data);
    });

    socket.on('deleteWebsite', function(data) {
    	removeWebsite(data);
        console.log(data);
    });

    socket.on('disconnect', function() {
        console.log("Socket disconnect!");
        delete sockets[socket.id];
    });
};

function removeWebsite(name)
{
    console.log(websiteListController.removeFromTimer(name));
	Monitor.findOne({'name': name}, function(err, results) {
        websiteID = results._id;
        console.log(websiteID);
        Ping.remove({'name' : name}, function(error, result) { 
            console.log(result);
        });
        results.remove();
    });
}