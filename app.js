var express 				= require('express'),
    app 					= express(),
    server 					= require('http').createServer(app),
	io 						= require('socket.io').listen(server),
    bodyParser 				= require('body-parser'),
    mongoose 				= require('mongoose'),
    socketMVC 				= require('socket.mvc'),
    websiteListController   = require('./server/controllers/websitelist-controller'),
    websiteTableController  = require('./server/controllers/websiteTable-controller'),
    websiteGraphController  = require('./server/controllers/websitePingData-controller'),
    config 					= require('./config');

mongoose.connect('mongodb://localhost:27017/web-monitor');
app.use(bodyParser());

//request router
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/views/index.html');
});
app.get('/listWebsites', function(req, res) {
    res.sendFile(__dirname + '/client/views/urlAdded.html');
});
app.get('/graphs', function(req, res) {
    res.sendFile(__dirname + '/client/views/websiteGraph.html');
});

//to link js and css file in HTML files
app.use('/js', express.static(__dirname + '/client/js'));
app.use('/css', express.static(__dirname + '/client/css'));


//REST API
app.post('/api/websites', websiteListController.create);
app.get('/api/websites', websiteTableController.list);
app.get('/api/website/:name', websiteGraphController.findWebsite);
app.get('/api/getGraphData', websiteGraphController.list);
app.get('/api/getGraphData/:name', websiteGraphController.find);
// checkStatus('http://www.facebook.com/404');

//sendAlertMail();

server.listen(8002, function() {
    console.log('Listening ...');
});

//Set socket.io configuration here 
 //delegating socket.io, so that it can be used in any js file other than app.ja also
io.sockets.on('connection', function (socket) {
 socketMVC.init(io, socket, {
    debug: true,
    filePath: ['./server/routes/socket.js']
  });
});
/*
function sendAlertMail()
{

}*/