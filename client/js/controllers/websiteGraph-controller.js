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

var chartData = [];

//<div ng-controller="websiteTable">   urlAdded.html
app3.controller('websiteGraph', ['$scope', '$resource', 'socket', function($scope, $resource, socket) {

    //creates an API call specifically to get the name parameter. Mongo find operation
    var Monitor = $resource('/api/getGraphData/:name', {name: getParameterByName('q')});
    var getWebsiteDetails = $resource('/api/website/:name', {name: getParameterByName('q')});

    var isUp = [];
    var downTime = [];
    var upTime = [];
    var upCount = 0;
    var downCount = 0;
    // get all the results from pings table
        Monitor.query(function(results) {

            var sum = 0.0;
            for (i = 0; i < results.length; i++) {
                //search for which record in table update has come and update that record with new values
                var dateTime = new Date(results[i].time);
                
                sum+=  parseFloat(results[i].responseTime);

                if(results[i].isUp === "true")
                {
                    isUp.push(1);
                    upCount+= 1;
                }
                else
                {
                    isUp.push(0);
                }

                if(results[i].isStatusChange === "true" && results[i].isUp === "true")
                {
                    upTime.push(results[i].time);
                }
                else if(results[i].isStatusChange === "false" && results[i].isUp === "false")
                {
                    downCount+= 1;
                    downTime.push(results[i].time);
                }

                chartData.push({
                    date: dateTime,
                    visits: results[i].responseTime
                });
            }
            $scope.downTime = downTime;
            console.log(sum/results.length);
            $scope.responseTime = ((sum/results.length) * 1000).toFixed(2) + " ms";
            console.log((upCount/results.length) * 100);
            $scope.availability = (upCount/results.length) * 100 + " %";

            $scope.totalDowns = downCount + " times";

            getWebsiteDetails.query(function(results) {
            console.log(results);
            $scope.name = results[0].name;
            $scope.url = results[0].url;
            $scope.email = results[0].mailID;
            $scope.startTime = results[0].addedTime;
            $scope.pollInterval = results[0].pollInterval;

            });
            //draw response chart

            var chart = AmCharts.makeChart("chartdiv", {
                "type": "serial",
                "theme": "light",
                "marginRight": 80,
                "dataProvider": chartData,
                "valueAxes": [{
                    "position": "left",
                    "title": "Response Time"
                }],
                "graphs": [{
                    "id": "g1",
                    "fillAlphas": 0.4,
                    "valueField": "visits",
                     "balloonText": "<div style='margin:5px; font-size:19px;'>Visits:<b>[[value]]</b></div>"
                }],
                "chartScrollbar": {
                    "graph": "g1",
                    "scrollbarHeight": 80,
                    "backgroundAlpha": 0,
                    "selectedBackgroundAlpha": 0.1,
                    "selectedBackgroundColor": "#888888",
                    "graphFillAlpha": 0,
                    "graphLineAlpha": 0.5,
                    "selectedGraphFillAlpha": 0,
                    "selectedGraphLineAlpha": 1,
                    "autoGridCount": true,
                    "color": "#AAAAAA"
                },
                "chartCursor": {
                    "categoryBalloonDateFormat": "JJ:NN, DD MMMM",
                    "cursorPosition": "mouse"
                },
                "categoryField": "date",
                "categoryAxis": {
                    "minPeriod": "ss",
                    "parseDates": true
                },
                "export": {
                    "enabled": true
                }
            });

            chart.addListener("dataUpdated", zoomChart);
            // when we apply theme, the dataUpdated event is fired even before we add listener, so
            // we need to call zoomChart here
            zoomChart();
            // this method is called when chart is first inited as we listen for "dataUpdated" event
            function zoomChart() {
                // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
                chart.zoomToIndexes(chartData.length - 250, chartData.length - 100);
            }

            // when we apply theme, the dataUpdated event is fired even before we add listener, so
            // we need to call zoomChart here

        });
}]);


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}