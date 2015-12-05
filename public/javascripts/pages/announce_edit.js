announceEdit = angular.module('announceEdit', ['ngStorage']);
announceEdit.controller('announceEditController', function ($rootScope, $scope, $http, $window, $localStorage) {
//	$scope.number = window.location.search;
//	$scope.number = $scope.number.substr(8);
//	console.log('number is:', $scope.number);
    $scope.goingAnnounce = {};

	$scope.getContent = function(pAnnounce){
		$http({
            url: '/announce/getContent',
            method: 'POST',
            data: JSON.stringify({number: pAnnounce.number}),
            headers: {'Content-Type': 'application/json'}
        }).success(function(response) {
            $scope.goingAnnounce.number = pAnnounce.number;
            $scope.goingAnnounce.content = response.content;
            $scope.goingAnnounce.publisher = response.publisher;
            $scope.goingAnnounce.title = response.title;
        }).error(function(data, status) {
            console.log('Error ' + status + '. ' + data);
            $rootScope.message = 'Load Annouce Fails';
            $rootScope.editingAnnounce = null;
            $scope.goingAnnounce = {};
		});
	}
	
	$scope.edit = function(){
		$http({
			url: '/announce/edit',
			method: 'POST',
			data: JSON.stringify(
                {number: $scope.goingAnnounce.number, 
                 title:  $scope.goingAnnounce.title, 
                 content:$scope.goingAnnounce.content, 
                 token:  $localStorage.token
            }),
			headers: {'Content-Type': 'application/json'}
		}).success(function(response){
			console.log('response is:', response);
//            $rootScope.messageTitle = response.messageTitle;
            $rootScope.message = response.messageContent;
            $("#message").alert();
            $("#message").fadeTo(5000, 500).slideUp(500, function() {});
			
		}).error(function(data, status){
//			$scope.messageTitle = 'Error';
//			$scope.messageContent = '更新失敗。';
            $rootScope.message = data.messageContent;
	        $("#message").alert();
            $("#message").fadeTo(5000, 500).slideUp(500, function() {});
			console.log('Error ' + status + '. ' + data);
		});
	}
    
    $scope.backToList = function() {
        $rootScope.editingAnnounce = null;
    }
    
    $scope.$on('inquiry-announce', function(event, data) {
        console.log('On inquiry-announce event', data);
        $scope.getContent(data);
    });
	
//	$scope.getContent();
	
});