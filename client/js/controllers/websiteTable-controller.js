//attaching socket to this JS file, adds socket.on and socket.emit to this part of code 

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
app2.controller('websiteTable', ['$scope', '$resource', 'socket', function($scope, $resource, socket) {
    var Monitor = $resource('/api/websites');

    //query and get all the websites stored in DB
    Monitor.query(function(results) {
        $scope.webResult = results;
    });

    // remove user - emits 'deleteWebsite' to server/routes/socket.js
    $scope.removeWebsite = function(index) {
        socket.emit('deleteWebsite', $scope.webResult[index].name);
        console.log(index + "   " + $scope.webResult[index].name);
        $scope.webResult.splice(index, 1);
    };

    //gets data real time from the server
    socket.on('websiteStatus', function(data) {
        console.log($scope.webResult);
        var i;
        if ($scope.webResult != undefined) {
            for (i = 0; i < $scope.webResult.length; i++) {
                console.log($scope.webResult[i].name);
                console.log(data.name);
                //search for which record in table update has come and update that record with new values
                if ($scope.webResult[i].name.localeCompare(data.name) == 0) {
                    break;
                }
            }
            
            $scope.webResult[i].statusCode = data.statusCode;
            $scope.webResult[i].isUp = data.isUp;
            $scope.webResult[i].responseTime = data.responseTime;
        }
    });
}]);