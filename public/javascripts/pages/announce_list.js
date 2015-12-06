announceList = angular.module('announceList', ['ngSanitize', 'ngAnimate']);
announceList.controller('announceListController', function ($rootScope, $scope, $http, $window) {
    $("#message").hide();
	$scope.page = 1;
	$scope.annPerPage = 10;
	$scope.annList;
	$scope.displayList;
    $scope.progressing = false;
	
    $scope.hideMessage = function() {
        $("#message").hide();
    }
    
	$scope.getContent = function(ann){
		if(ann.expand==1){
			ann.expand = 0;
			return;
		}
        
        ann.progressing = true;
        
		$http({
            url: '/announce/getContent',
            method: 'POST',
            data: JSON.stringify({number: ann.number}),
            headers: {'Content-Type': 'application/json'}
        }).success(function(response) {
            ann.content = response.content;
            ann.publisher = response.publisher;
            ann.progressing = false;
            ann.expand = 1;
        }).error(function(data, status) {
            ann.progressing = false;
            console.log('Error ' + status + '. ' + data);
		});
	}
	
	$scope.getList = function(){
        $scope.progressing = true;
        
		$http({
            url: '/announce/getList',
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        }).success(function(response) {
            $scope.progressing = false;    

            $scope.totalAnnounce = response.length; //response長度=總公告數量
            $scope.totalPages = Math.ceil($scope.totalAnnounce/$scope.annPerPage); //計算頁數

            //修改時間格式
            $scope.annList = response;
            angular.forEach($scope.annList, function(value, key) {
                value.formatedCreatedDate = formatDate(new Date(value.createdDate));
                value.expand = 0;
            });

            //切割, 取得要顯示的公告
            $scope.displayList = response.slice(($scope.page-1)*$scope.annPerPage, ($scope.page*$scope.annPerPage));
        }).error(function(data, status) {
            $scope.progressing = false; 
            console.log('Error ' + status + '. ' + data);
		});
	}
	
	$scope.format = function (pDate) {
		return new Date(pDate).format('yyyy-MM-dd');
	}
	
	$scope.changePage = function(n){
		if(n==1 && $scope.totalPages>$scope.page){
			++$scope.page;
			$scope.getList();
		}
		else if(n==-1 && $scope.page>1){
			--$scope.page;
			$scope.getList();
		}
		else if(n==10 && ($scope.page+10)<=$scope.totalPages){
			$scope.page += 10;
			$scope.getList();
		}
		else if(n==-10 && ($scope.page-10)>0 ){
			$scope.page -= 10;
			$scope.getList();
		}
		else if(n==0 && $scope.page!=1){
			$scope.page = 1;
			$scope.getList();
		}
		else if(n==999 && $scope.page!=$scope.totalPages){
			$scope.page = $scope.totalPages;
			$scope.getList();
		}
		else{
			console.log('Unknown status.');
		}
	}
    
    $scope.editAnnounce = function(editingAnnounce) {
        $rootScope.editingAnnounce = editingAnnounce;
        $rootScope.$broadcast('inquiry-announce', $rootScope.editingAnnounce);
    }
    
    $scope.createAnnounce = function() {
        $rootScope.creatingAnnounce = true;
        $rootScope.$broadcast('create-announce', $rootScope.editingAnnounce);
    }
    
    //
    $scope.$on('refresh-announce-list', function(event) {
        console.log('On refresh-announce-list event');
        $scope.getList();
    });
    
	$scope.getList();
});