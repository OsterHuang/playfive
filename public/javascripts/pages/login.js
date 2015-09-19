loginPage = angular.module('loginPage', ['ngStorage']);
loginPage.controller('loginController', function ($rootScope, $scope, $http, $window, $localStorage) {
    
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
});