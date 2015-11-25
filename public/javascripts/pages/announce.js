announce = angular.module('announce', []);
announce.controller('announceController', function ($scope, $http, $window) {
    
    $("#success-alert").hide();
    
    $scope.hideMessage = function() {
        $("#success-alert").hide();
    }
    
    $scope.show = function() {
		$http({
                url: '/announce/show',
                method: 'POST',
                data: JSON.stringify({num:$scope.num}),
                headers: {'Content-Type': 'application/json'}
        }).success(function(response) {
            console.log(response);
            $scope.messageTitle = response.messageTitle;
            $scope.messageContent = response.messageContent;
            $("#success-alert").alert();
            $("#success-alert").fadeTo(5000, 500).slideUp(500, function() {});
        }).error(function(data, status) {
            console.log('Error ' + status + '. ' + data);
            $scope.messageTitle = 'Error.';
            $scope.messageContent = data.error;
            $("#success-alert").alert();
            $("#success-alert").fadeTo(5000, 500).slideUp(500, function() {});
        });
    }
	
    $scope.create = function() {
		$http({
			url: '/announce/create',
			method: 'POST',
			data: JSON.stringify({publisher:$scope.publisher, title:$scope.title, content:$scope.content, isTop:$scope.isTop, token: $localStorage.token}),
			headers: {'Content-Type': 'application/json'}
		}).success(function(response) {
            console.log(response);
            $scope.messageTitle = response.messageTitle;
            $scope.messageContent = response.messageContent;
            $("#success-alert").alert();
            $("#success-alert").fadeTo(5000, 500).slideUp(500, function() {});
			if($scope.messageTitle == 'Success') location="list.html";
        }).error(function(data, status) {
            console.log('Error ' + status + '. ' + data);
            $scope.messageTitle = 'Error.';
            $scope.messageContent = data.error;
            $("#success-alert").alert();
            $("#success-alert").fadeTo(5000, 500).slideUp(500, function() {});
        });
    }
});