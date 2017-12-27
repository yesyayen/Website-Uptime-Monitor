app.controller('addWebsiteController', ['$scope', '$resource', function ($scope, $resource) {

	var Monitor = $resource('/api/websites');

	$scope.websiteName = "website_name";
	$scope.websiteURL = "http://www.website.com";
	$scope.pollInterval = 20;
	$scope.mailID = "email@gmail.com";
	$scope.mobileNumber = "some_number";
	$scope.mobileProvider = "some_provider";
	
	//add website information to database
	$scope.addWebsites = function() {
		var monitor = new Monitor();
		monitor.name = $scope.websiteName;
		monitor.url = $scope.websiteURL;
		monitor.pollInterval = $scope.pollInterval;
		monitor.mailID = $scope.mailID;
		monitor.mobileNumber = $scope.mobileNumber;
		monitor.mobileProvider = $scope.mobileProvider;
		monitor.isUp = "checking...";
		monitor.isAlert = true;

		monitor.$save(function(result) {
			$scope.websiteName = "";
			$scope.websiteURL = "";
			$scope.pollInterval = "";
			$scope.mailID = "";
			$scope.mobileNumber = "";
			$scope.mobileProvider = "";
		});
	}
}]);