account = angular.module('account', ['ngStorage']);
account.controller('accountController', function ($scope, $http, $localStorage, $window) {
    
    $("#success-alert").hide();

	
	if(typeof $localStorage.language == 'undefined')
		$localStorage.language = 'English';
	
	$scope.language = $localStorage.language;
	
	window.translate($scope, $localStorage.language, 'create.html');
	
	$scope.command = 'reset';
    
    $scope.hideMessage = function() {
        $("#success-alert").hide();
    }
    
    $scope.create = function() {
        $http({
                url: '/account/createAccount',
                method: 'POST',
                data: JSON.stringify({username:$scope.username, nickname:$scope.nickname, password:$scope.password, email:$scope.email, language: $scope.language}),
                headers: {'Content-Type': 'application/json', 'language': 'Chinese'}
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

	$scope.translate = function(){
		$localStorage.language = $scope.language;
		window.translate($scope, $scope.language, 'create.html');
		
		console.log('scope.lang:', $scope.language);
		console.log('locals.lang:', $localStorage.language);
	}
	/*$scope.translate = function(){
		switch($scope.language){
			case 'Chinese':
				$scope.str_selectLanguage = '請選擇語言：';
				$scope.str_createAccount = '建立新帳號';
				$scope.str_username = '帳號';
				$scope.str_nickname = '暱稱';
				$scope.str_password = '密碼';
				$scope.str_email = 'E-mail';
				$scope.str_language = '語言';
				$scope.str_apply = '送出申請';
				$scope.str_unavailable = '已存在';
				$scope.str_resend = '重寄認證信';
				$scope.str_reset = '重設密碼(忘記密碼請選我)';
				$scope.str_reset_title = '重設密碼';
				$scope.str_renew = '更改密碼';
				$scope.str_selectCommand = '請選擇功能：';
				$scope.str_usernameOrEmail = '請輸入帳號或E-mail，擇一即可';
				$scope.str_oldPassword = '舊密碼';
				$scope.str_newPassword = '新密碼';
				$scope.str_newPassword2 = '確認新密碼';
				
			break;
			
			case 'English':
			default:
				$scope.str_selectLanguage = 'Select Your Language:';
				$scope.str_createAccount = 'Create New Account';
				$scope.str_username = 'Username';
				$scope.str_nickname = 'Nickname';
				$scope.str_password = 'Password';
				$scope.str_email = 'E-mail';
				$scope.str_language = 'Language';
				$scope.str_apply = 'Apply';
				$scope.str_unavailable = 'Unavailable';
				$scope.str_resend = 'Resend Verification Mail';
				$scope.str_reset = 'Reset Password (if you forget your old password)';
				$scope.str_reset_title = 'Reset Password';
				$scope.str_renew = 'Change Password';
				$scope.str_selectCommand = 'Select One Function:';
				$scope.str_usernameOrEmail = 'Please provide your username OR E-mail';
				$scope.str_oldPassword = 'Original Password';
				$scope.str_newPassword = 'New Password';
				$scope.str_newPassword2 = 'Repeat New Password';
				
			break;
			
		}
	}*/
	
	
});