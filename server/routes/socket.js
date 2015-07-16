var sockets = {}
module.exports = function(socket) {
    //You can declare all of your socket listeners in this file, but it's not required 

    sockets[socket.id] = socket; //appending the socket ID of the client to the array

    socket.on('createNote', function(data) {
        console.log(data);
    });

    socket.on('disconnect', function() {
        console.log("Socket disconnect!");
        delete sockets[socket.id];
    });
};