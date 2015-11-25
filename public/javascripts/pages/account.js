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
	
	$scope.check_username = function() {
        $http({
			url: '/account/check_username',
			method: 'POST',
			data: JSON.stringify({username:$scope.username}),
			headers: {'Content-Type': 'application/json'}
        }).success(function(response) {
            console.log(response);
            if (response.messageTitle == 'Success')
				$scope.usernameOk = true;
			if (response.messageTitle == 'Sorry')
				$scope.usernameOk = false;
        }).error(function(data, status) {
            console.log('Error ' + status + '. ' + data);
            $scope.messageTitle = 'Error.';
            $scope.messageContent = data.error;
            $("#success-alert").alert();
            $("#success-alert").fadeTo(5000, 500).slideUp(500, function() {});
        });
	}
	
	$scope.check_nickname = function() {
        $http({
			url: '/account/check_nickname',
			method: 'POST',
			data: JSON.stringify({nickname:$scope.nickname}),
			headers: {'Content-Type': 'application/json'}
        }).success(function(response) {
            console.log(response);
            if (response.messageTitle == 'Success')
				$scope.nicknameOk = true;
			if (response.messageTitle == 'Sorry')
				$scope.nicknameOk = false;
        }).error(function(data, status) {
            console.log('Error ' + status + '. ' + data);
            $scope.messageTitle = 'Error.';
            $scope.messageContent = data.error;
            $("#success-alert").alert();
            $("#success-alert").fadeTo(5000, 500).slideUp(500, function() {});
        });
	}
	
	$scope.check_email = function() {
        //$scope.emailOk = true;
		
		$http({
			url: '/account/check_email',
			method: 'POST',
			data: JSON.stringify({email:$scope.email}),
			headers: {'Content-Type': 'application/json'}
        }).success(function(response) {
            console.log(response);
            if (response.messageTitle == 'Success')
				$scope.emailOk = true;
			if (response.messageTitle == 'Sorry')
				$scope.emailOk = false;
        }).error(function(data, status) {
            console.log('Error ' + status + '. ' + data);
            $scope.messageTitle = 'Error.';
            $scope.messageContent = data.error;
            $("#success-alert").alert();
            $("#success-alert").fadeTo(5000, 500).slideUp(500, function() {});
        });
	}
	
    $scope.reverify = function() {
		console.log('reverify?');
		$http({
                url: '/account/reverify',
                method: 'POST',
                data: JSON.stringify({username:$scope.username, email:$scope.email}),
                headers: {'Content-Type': 'application/json'}
            }
        ).success(function(response) {
            console.log('response is:', response);
            $scope.messageTitle = response.messageTitle;
            $scope.messageContent = response.messageContent;
            $("#success-alert").alert();
            $("#success-alert").fadeTo(5000, 500).slideUp(500, function() {});
            console.log($scope.messageTitle + $scope.messageContent);
        }).error(function(data, status) {
            console.log('Error ' + status + '. ' + data);
            $scope.messageTitle = 'Error.';
            $scope.messageContent = data.error;
            $("#success-alert").alert();
            $("#success-alert").fadeTo(5000, 500).slideUp(500, function() {});
			console.log('failed?');
        });
		console.log('-- End of reverify. --', response);
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
});