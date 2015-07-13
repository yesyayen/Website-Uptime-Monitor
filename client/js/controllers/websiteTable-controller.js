app2.controller('websiteTable', ['$scope', '$resource', function ($scope, $resource) {
	var Monitor = $resource('/api/websites');

	$scope.asdf = "asd";

	Monitor.query(function (results) {
		console.log(results);
		$scope.webResult = results;
	});


}]);