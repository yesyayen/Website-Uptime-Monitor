app2.factory('socket', function($rootScope) {
	var socket = io.connect();
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});


app2.controller('websiteTable', ['$scope', '$resource', 'socket', function ($scope, $resource, socket) {
	var Monitor = $resource('/api/websites');

	Monitor.query(function (results) {
		$scope.webResult = results;
	});
	
	// Incoming
	socket.on('websiteStatus', function(data) {
		$scope.webStatus = data;
		if($scope.webResult != undefined)
		{
			$scope.webResult[$scope.webResult.length - 1].isUp = "true";
		}	
	});

	socket.on('shabbaaaa', function(data) {
		console.log("adasdasdasdasddadaasdsadadasd");	
	});

	// Outgoing - to server
	socket.emit('createNote', 'note');
}]);