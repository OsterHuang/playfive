function translate($scope, language, filename){
	if(filename=='create.html'){
		switch(language){
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
	}
	else if(1){
		
	}
}