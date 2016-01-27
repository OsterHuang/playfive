announceCreate = angular.module('announceCreate', ['ngStorage']);
announceCreate.controller('announceCreateController', function ($rootScope, $scope, $http, $localStorage, $window) {
    
    $scope.newAnnounceInit = {category:'', title:'', content:'', isTop:''};
    $scope.newAnnounce = angular.copy($scope.newAnnounceInit); //console.log('Copy value of newAnnounce:', $scope.newAnnounce);
    
    $scope.hideMessage = function() {
        $("#message").hide();
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
            $rootScope.message = response.messageContent;
            $("#message").alert();
            $("#message").fadeTo(5000, 500).slideUp(500, function() {});
        }).error(function(data, status) {
            console.log('Error ' + status + '. ' + data);
            $scope.messageTitle = 'Error.';
            $rootScope.message = data.error;
            $("#message").alert();
            $("#message").fadeTo(5000, 500).slideUp(500, function() {});
        });
    }
	
    $scope.create = function() {
        var requestData = {
            category:$scope.newAnnounce.category, 
            title:$scope.newAnnounce.title, 
            content:$scope.newAnnounce.content, 
            isTop:$scope.newAnnounce.isTop, 
            token: $localStorage.token
        };
        
        console.log('Request data is', requestData);
		$http({
			url: '/announce/create',
			method: 'POST',
			data: JSON.stringify(requestData),
			headers: {'Content-Type': 'application/json'}
		}).success(function(response) {
            console.log(response);
            $scope.messageTitle = response.messageTitle;
            $rootScope.message = response.messageContent;
            $("#message").alert();
            $("#message").fadeTo(5000, 500).slideUp(500, function() {});
            
            $scope.newAnnounce = angular.copy($scope.newAnnounceInit);
            $rootScope.creatingAnnounce = false;
            $rootScope.$broadcast('refresh-announce-list', $rootScope.editingAnnounce);
//			if($scope.messageTitle == 'Success') location="list.html";
        }).error(function(data, status) {
            console.log('Error ' + status + '. ' + data);
            $scope.messageTitle = 'Error.';
            $rootScope.message = data.error;
            $("#message").alert();
            $("#message").fadeTo(5000, 500).slideUp(500, function() {});
        });
    }
    
    $scope.backToList = function() {
        $rootScope.creatingAnnounce = null;
    }
    
    $scope.$on('create-announce', function(event) {
        console.log('On create-announce event', event);
    });
    
    $("#message").hide();
});