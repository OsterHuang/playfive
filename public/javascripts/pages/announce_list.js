announce = angular.module('announce', []);
announce.controller('announceController', function ($scope, $http, $window) {
    //$scope.page = ;
    $("#success-alert").hide();
	$scope.page = 1;
	$scope.annList;
	$scope.displayList;
	
    $scope.hideMessage = function() {
        $("#success-alert").hide();
    }
    
	$scope.getContent = function(ann){
		if(ann.expand==1){
			ann.expand = 0;
			return;
		}
		ann.expand = 1;
		console.log('ann.number is: ', ann.number);
		$http({
				url: '/announce/getContent',
				method: 'POST',
				data: JSON.stringify({number: ann.number}),
				headers: {'Content-Type': 'application/json'}
			}).success(function(response) {
				ann.content = response.content;
				ann.publisher = response.publisher;
			}).error(function(data, status) {
				console.log('Error ' + status + '. ' + data);
		});
	}
	
	$scope.getList = function(){
		$http({
				url: '/announce/getList',
				method: 'POST',
				//data: JSON.stringify({page: }),
				headers: {'Content-Type': 'application/json'}
			}).success(function(response) {
				//console.log('response is : ', response);
				
				//計算elements數量
				$scope.totalAnnounce = response.length;
				$scope.totalPages = Math.ceil($scope.totalAnnounce/20);
				console.log('totalAnnounce is:', $scope.totalAnnounce);
				console.log('totalPages is:', $scope.totalPages);
				
				$scope.annList = response;
				angular.forEach($scope.annList, function(value, key) {
					//console.log('%s : %o' , key, value);
					value.formatedCreatedDate = formatDate(new Date(value.createdDate));
					value.expand = 0;
				});
				//切割
				//$scope.displayList = response.slice(($scope.page-1)*20, ($scope.page*20));
				$scope.displayList = response;
				console.log('displayList is:', $scope.displayList);
				
				/*$scope.messageTitle = response.messageTitle;
				$scope.messageContent = response.messageContent;
				$("#success-alert").alert();
				$("#success-alert").fadeTo(5000, 500).slideUp(500, function() {});*/
			}).error(function(data, status) {
				console.log('Error ' + status + '. ' + data);
				/*$scope.messageTitle = 'Error.';
				$scope.messageContent = data.error;
				$("#success-alert").alert();
				$("#success-alert").fadeTo(5000, 500).slideUp(500, function() {});*/
		});
	}
	
	$scope.format = function (pDate) {
		console.log('Format Date:', pDate);
		return new Date(pDate).format('yyyy-MM-dd');
	}
	
	$scope.getList();
	
});