var sockets = [];		//array to store the socket ID of all the clients that are connected with this server

module.exports = function(io){

	//socket.io incommming and outgoing socket requests

	io.sockets.on('connection', function(socket) {

		sockets.push(socket);		//appending the socket ID of the client to the array

		socket.on('createNote', function(data) {
			//socket.broadcast.emit('onNoteCreated', data);
			console.log(data);
		});

		if(sockets.length > 2)
		{
			console.log("yaaaaa");
		}

		socket.on('disconnect', function () {
	        console.log("Socket disconnect!");
    	});

	});
}

module.exports = {
	checkStatus: function(url)
	{
		var curl = new Curl();
		curl.setOpt('URL', url);
		curl.setOpt( Curl.option.TIMEOUT, 30 );
		curl.setOpt('FOLLOWLOCATION', true);

		curl.on('end', function(statusCode, body, headers) {

			console.info( 'URL', url);
		    console.info( 'Status Code: ', statusCode );
		    io.sockets.emit('onNoteCreated', statusCode);
		    console.info( 'TOTAL_TIME: ', this.getInfo('TOTAL_TIME') );
		    console.info( 'Body length: ', body.length );

		    this.close();
		});
		//curl.on( 'error', curl.close.bind( curl ) );
		curl.on('error', cb);
		curl.perform();
	},

	cb: function(statusOrError) 
	{
	    var siteName = this.getInfo(Curl.info.PRIVATE);
	    if(siteName == undefined)
		{

		}

	    this.close();

	    if (typeof statusOrError !== "number") { //we have an error
	        console.error(siteName, ' - Error: ', statusOrError);
	    } else {
	        console.info(siteName, ': ', statusOrError);
	    }
	    return;
	}
};