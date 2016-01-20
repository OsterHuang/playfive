loginPage = angular.module('loginPage', ['ngStorage']);
loginPage.controller('loginController', function ($rootScope, $scope, $http, $window, $localStorage) {
    
	if(typeof $scope.language == 'undefined'){
		if(typeof $localStorage.language == 'undefined'){
			$localStorage.language = 'English';
			$scope.language = 'English';
		}
		else $scope.language = $localStorage.language;
	}
		
	window.translate($scope, $localStorage.language, 'login.html');
	
    $("#message").hide();
    
    $scope.hideMessage = function() {
        $("#message").hide();
    }
    
    $scope.login = function() {
        $http(
            {
                url: '/users/login',
                method: 'POST',
                data: JSON.stringify({username:$scope.username, password:$scope.password}),
                headers: {'Content-Type': 'application/json'}
            }
              
        ).success(function(response) {
            console.log(response);
            if (response.result != 'success') {
                $scope.message = response.message;
                $("#message").alert();
                $("#message").fadeTo(5000, 500).slideUp(500, function() {});
                //$window.location = '/login.html'
            } else {
                $scope.message = null;
                $localStorage.token = response.token;
                if(typeof response.language != 'undefined')
					$localStorage.language = response.language;
                $window.location = '/main.html';
            }
            
        }).error(function(data, status) {
            console.log('Error ' + status + '. ' + data);
            $scope.result = 'Error.';
            $scope.message = data.error;
            $("#message").alert();
            $("#message").fadeTo(5000, 500).slideUp(500, function() {});
        });
    };
    
    $scope.applyNewAccount = function() {
        $window.location = '/account/create.html';
    };

	$scope.translate = function(language){
		$localStorage.language = language;
		window.translate($scope, language, 'login.html');
	}
	
});