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
		console.log($scope.webResult);
		var i;
		if($scope.webResult != undefined)
		{
			for(i = 0; i < $scope.webResult.length; i++)
			{
				console.log($scope.webResult[i].name);
				console.log(data.name);
				if($scope.webResult[i].name.localeCompare(data.name) == 0)
				{
					break;
				} 
			}
			$scope.webResult[i].statusCode = data.statusCode;
			$scope.webResult[i].isUp = data.isUp;
			$scope.webResult[i].responseTime = data.responseTime;
		}	
	});

	socket.on('shabbaaaa', function(data) {
		console.log("adasdasdasdasddadaasdsadadasd");	
	});

	// Outgoing - to server
	socket.emit('createNote', 'note');
}]);