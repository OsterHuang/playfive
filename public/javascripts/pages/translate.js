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
	else if(filename=='main.html'){
		switch(language){
		case 'Chinese':
			$scope.str_nickname = '暱稱';
			$scope.str_rank = '積分';
			$scope.str_action = '選項';
			$scope.str_rule = '規則';
			$scope.str_timeRule = '計時';
			$scope.str_createGame = '建立對局';
			$scope.str_cancelGame = '取消隊局';
			$scope.str_number = '編號';
			$scope.str_creator = '建立者';
			$scope.str_rank = '積分';
			$scope.str_onlyWith = '指定對手';
			$scope.str_onlineUsers = '線上使用者';
			$scope.str_awaitingGames = '等待中對局';
			$scope.str_ongoingGames = '進行中對局';
			$scope.str_announcements = '公佈欄';
			$scope.str_gomokuRule = '普通規則';
			$scope.str_renjuRule = '日式規則';
			$scope.str_classicRule = '經典規則';
			$scope.str_yamaguchiRule = '山口規則';
			$scope.str_basicTime = '基本時間';
			$scope.str_min = '分';
			$scope.str_timePerMove = '每手限時';
			$scope.str_seconds = '秒';
			$scope.str_plueTimePerMove = '每手加時';
			$scope.str_ratingGame = '計分對局';
			$scope.str_tBlack = '持黑';
			$scope.str_opponent = '對手';
			$scope.str_send = '傳送';
			$scope.str_yourMessage = '在此輸入訊息...';
			$scope.str_gameNumber = '對局編號';
			$scope.str_amountOfMoves = '手數';
			$scope.str_rated = '計分對局';
			$scope.str_notRated = '非計分對局';
			$scope.str_5thQuantity = '第五手數量';
			$scope.str_whosTurn = '正在思考中...';
			$scope.str_theGameIsFinished = '對局已結束';
			$scope.str_offerDraw = '提和';
			$scope.str_offerPass = '虛手';
			$scope.str_resign = '認輸';
			$scope.str_quit = '離開';
			$scope.str_channelNumber = '對局';
			$scope.str_channel = '聊天室';
			//$scope.str_ = '';
		break;
		case 'English':
		default:
			$scope.str_nickname = 'Nickname';
			$scope.str_rank = 'Rank';
			$scope.str_action = 'Actions';
			$scope.str_rule = 'Rule';
			$scope.str_timeRule = 'Time Rule';
			$scope.str_createGame = 'Create Game';
			$scope.str_cancelGame = 'Cancel Game';
			$scope.str_number = 'Number';
			$scope.str_creator = 'Creator';
			$scope.str_rank = 'Rank';
			$scope.str_onlyWith = 'Only With';
			$scope.str_onlineUsers = 'Online Users';
			$scope.str_awaitingGames = 'Awaiting Games';
			$scope.str_ongoingGames = 'Ongoing Games';
			$scope.str_announcements = 'Announcements';
			$scope.str_gomokuRule = 'Gomoku';
			$scope.str_renjuRule = 'Renju';
			$scope.str_classicRule = 'Classic Rule';
			$scope.str_yamaguchiRule = 'Yamaguchi Rule';
			$scope.str_basicTime = 'Basic Time';
			$scope.str_min = 'minutes';
			$scope.str_timePerMove = 'Time Per Move';
			$scope.str_seconds = 'seconds';
			$scope.str_plueTimePerMove = 'Plue Time Per Move';
			$scope.str_ratingGame = 'rating game';
			$scope.str_tBlack = 'tentative black';
			$scope.str_opponent = 'Opponent';
			$scope.str_send = 'Send';
			$scope.str_yourMessage = 'Your Message...';
			$scope.str_gameNumber = 'Game NO.';
			$scope.str_amountOfMoves = 'Move';
			$scope.str_rated = 'Rated';
			$scope.str_notRated = 'Not Rated';
			$scope.str_5thQuantity = '5th Quantity';
			$scope.str_whosTurn = 'is thinking...';
			$scope.str_theGameIsFinished = 'The game is finished.';
			$scope.str_offerDraw = 'Draw';
			$scope.str_offerPass = 'Pass';
			$scope.str_resign = 'Resign';
			$scope.str_quit = 'Quit';
			$scope.str_channelNumber = 'Game NO.';
			$scope.str_channel = 'Channel';
		break;
		}
	}
	else if(filename=='announce.html'){
		switch(language){
		case 'Chinese':
			$scope.str_add = '新增';
			$scope.str_refresh = '取得最新公告';
			$scope.str_number = '編號';
			$scope.str_title = '標題';
			$scope.str_date = '日期';
			$scope.str_edit = '編輯';
			//$scope.str_ = '';
		break;
		case 'English':
		default:
			$scope.str_add = 'Add';
			$scope.str_refresh = 'Refresh';
			$scope.str_number = 'NO.';
			$scope.str_title = 'Titile';
			$scope.str_date = 'Date';
			$scope.str_edit = 'Edit';
		break;
		}
	}
	else if(filename=='login.html'){
		switch(language){
		case 'Chinese':
			$scope.str_username = '帳號';
			$scope.str_password = '密碼';
			$scope.str_login = '登入';
			$scope.str_notAMemberYet = '還不是會員嗎';
			$scope.str_joinNow = '加入我們';
			$scope.str_accountProblems = '帳號問題';
			//$scope.str_ = '';
		break;
		case 'English':
		default:
			$scope.str_username = 'Username';
			$scope.str_password = 'Password';
			$scope.str_login = 'Login';
			$scope.str_notAMemberYet = 'Not a Member yet';
			$scope.str_joinNow = 'Join Now';
			$scope.str_accountProblems = 'Account Problems';
		break;
		}
	}
}