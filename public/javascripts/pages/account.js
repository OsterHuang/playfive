account = angular.module('account', []);
account.controller('accountController', function ($scope, $http, $window) {
    
    $("#success-alert").hide();
    
    $scope.hideMessage = function() {
        $("#success-alert").hide();
    }
    
    $scope.create = function() {
        $http({
                url: '/account/createAccount',
                method: 'POST',
                data: JSON.stringify({username:$scope.username, nickname:$scope.nickname, password:$scope.password, email:$scope.email}),
                headers: {'Content-Type': 'application/json'}
            }
        ).success(function(response) {
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
	
    $scope.reverify = function() {
        console.log('看不懂啦');
		$http({
                url: '/account/reverify',
                method: 'POST',
                data: JSON.stringify({username:$scope.username, email:$scope.email}),
                headers: {'Content-Type': 'application/json'}
            }
        ).success(function(response) {
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
	
	$scope.reset = function() {
        $http({
                url: '/account/reset',
                method: 'POST',
                data: JSON.stringify({username:$scope.username, email:$scope.email}),
                headers: {'Content-Type': 'application/json'}
            }
        ).success(function(response) {
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
	
	$scope.renew = function() {
        $http({
                url: '/account/renew',
                method: 'POST',
                data: JSON.stringify({username:$scope.username, password:$scope.password, newPsd: $scope.newPsd}),
                headers: {'Content-Type': 'application/json'}
            }
        ).success(function(response) {
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
	
	
    /*
	$scope.update = function(){
		$http({
			url: ''	
			}
		)
	}
	
    $scope.query = function() {
        $http({
                url: '/dog/listDog',
                method: 'POST',
                data: null,
                headers: {'Content-Type': 'application/json'}
            }
              
        ).success(function(response) {
            console.log(response);
            if (response.dogList) {
                $scope.dogList = response.dogList;
                
            } else {
                $scope.messageTitle = '';
                $scope.messageContent = 'Data not found';
                $("#success-alert").alert();
                $("#success-alert").fadeTo(5000, 500).slideUp(500, function() {});
            }
            
        }).error(function(data, status) {
            console.log('Error ' + status + '. ' + data);
            $scope.messageTitle = 'Error.';
            $scope.messageContent = data.error;
            $("#success-alert").alert();
            $("#success-alert").fadeTo(5000, 500).slideUp(500, function() {});
        });
    }
    */
});