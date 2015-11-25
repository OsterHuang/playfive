admin = angular.module('admin', []);
admin.controller('adminController', function ($scope, $http, $window) {
    
    $("#success-alert").hide();
    
    $scope.hideMessage = function() {
        $("#success-alert").hide();
    }
	
	$scope.check_nickname = function() {
        $http({
			url: '/admin/check_nickname',
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
	
	$scope.login = function() {
        $http({
                url: '/admin/login',
                method: 'POST',
                data: JSON.stringify({password:$scope.password}),
                headers: {'Content-Type': 'application/json'}
            }
        ).success(function(response) {
            console.log(response);
			$scope.adminList = response;
            /*$scope.messageTitle = response.messageTitle;
            $scope.messageContent = response.messageContent;
            $("#success-alert").alert();
            $("#success-alert").fadeTo(5000, 500).slideUp(500, function() {});*/
        }).error(function(data, status) {
            console.log('Error ' + status + '. ' + data);
            $scope.messageTitle = 'Error.';
            $scope.messageContent = data.error;
            $("#success-alert").alert();
            $("#success-alert").fadeTo(5000, 500).slideUp(500, function() {});
        });
    }
	
	$scope.add = function() {
        $http({
                url: '/admin/add',
                method: 'POST',
                data: JSON.stringify({password:$scope.password, nickname:$scope.nickname}),
                headers: {'Content-Type': 'application/json'}
            }
        ).success(function(response) {
            console.log(response);
			$scope.adminList = response.adminList;
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
	
	$scope.del = function() {
        $http({
                url: '/admin/del',
                method: 'POST',
                data: JSON.stringify({password:$scope.password, nickname:$scope.picked}),
                headers: {'Content-Type': 'application/json'}
            }
        ).success(function(response) {
            console.log(response);
			$scope.adminList = response.adminList;
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
	
	$scope.pick = function(nickname){
		$scope.picked = nickname;
	}
});