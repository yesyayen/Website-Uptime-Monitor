//attaching socket to this JS file, adds socket.on and socket.emit to this part of code 

app3.factory('socket', function($rootScope) {
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
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
});
//attaching socket to this JS file

//<div ng-controller="websiteTable">   urlAdded.html
app3.controller('websiteGraph', ['$scope', '$resource', 'socket', function($scope, $resource, socket) {
    var Monitor = $resource('/api/getGraphData');

    //query and get all the websites stored in DB
    

    // remove user - emits 'deleteWebsite' to server/routes/socket.js
    $scope.showgraph = function() {
        console.log("results");
        Monitor.query(function(results) {
        console.log(results);
    });
        //socket.emit('deleteWebsite', $scope.webResult[index].name);
    };
}]);