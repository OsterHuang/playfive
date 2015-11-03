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
			data: JSON.stringify({publisher:$scope.publisher, title:$scope.title, content:$scope.content, isTop:$scope.isTop}),
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
	
/*	
	$scope.check_username = function() {
        $http({
			url: '/announce/check_username',
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
			url: '/announce/check_nickname',
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
        $http({
			url: '/announce/check_email',
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
        console.log('看不懂啦');
		$http({
                url: '/announce/reverify',
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
                url: '/announce/reset',
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
                url: '/announce/renew',
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
	*/
});