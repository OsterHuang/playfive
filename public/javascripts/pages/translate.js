function translate($scope, language, filename){
	console.log('有被直行兩次嗎?');
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
			$scope.str_cancelGame = '取消對局';
			$scope.str_number = '編號';
			$scope.str_creator = '建立者';
			$scope.str_onlyWith = '指定對手';
			$scope.str_onlineUsers = '線上使用者';
			$scope.str_awaitingGames = '開始對局';
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
			$scope.str_timeRuleNotValied = '時間設置不正確';
			$scope.str_plusTimePerMove = '每手加時';
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
			$scope.str_doubleClick = '雙擊落子';
			$scope.str_confirmCheck = '確認落子';
			$scope.str_whosTurn = '正在思考中...';
			$scope.str_theGameIsFinished = '對局已結束';
			$scope.str_offerDraw = '提和';
			$scope.str_offerPass = '虛手';
			$scope.str_resign = '認輸';
			$scope.str_quit = '離開';
			$scope.str_channelNumber = '對局';
			$scope.str_channel = '聊天室';
			$scope.str_isMakingAlts = '正在思考打點...';
			$scope.str_isChoosingOpening = '正在選擇開局...';
			$scope.str_swapOrNot = '是否交換';
			$scope.str_isChoosingAlts = '正在選擇打點...';
			$scope.str_joinGame = '加入';
			$scope.str_participant = '參加者';
			$scope.str_watchGame = '觀戰';
			$scope.str_userInfo = '使用者資訊';
			$scope.str_profile = '檔案';
			$scope.str_username = '使用者名稱';
			$scope.str_email = 'E-mail';
			$scope.str_black = '黑方';
			$scope.str_white = '白方';
			$scope.str_moves = '手數';
			$scope.str_result = '結果';
			$scope.str_record = '戰績';
			$scope.str_last10Games = '最近10場對局';
			$scope.str_confirmAlts = '確定打點';
			$scope.str_confirmOpening = '確定開局';
			$scope.str_undo = '悔棋';
			$scope.str_announceList = '公告清單';
			$scope.str_noStartTime = '請至少勾選一項';
			$scope.str_noBasicTime = '最短基本時限：1 分鐘';
			$scope.str_morePerMoveTime = '最短每手時限：5 秒';
			$scope.str_morePlusTime = '最短每手加秒： 5 秒';
			$scope.str_notInt = '請輸入整數';
			$scope.str_finish = '結束';
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
			$scope.str_onlyWith = 'Only With';
			$scope.str_onlineUsers = 'Online Users';
			$scope.str_awaitingGames = 'Start To Play';
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
			$scope.str_timeRuleNotValied = 'Bad Time Rule';
			$scope.str_plusTimePerMove = 'Plus Time Per Move';
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
			$scope.str_doubleClick = 'Double Click';
			$scope.str_confirmCheck = 'Comfirm Check';
			$scope.str_whosTurn = 'is thinking...';
			$scope.str_theGameIsFinished = 'The game is finished.';
			$scope.str_offerDraw = 'Draw';
			$scope.str_offerPass = 'Pass';
			$scope.str_resign = 'Resign';
			$scope.str_quit = 'Quit';
			$scope.str_channelNumber = 'Game NO.';
			$scope.str_channel = 'Channel';
			$scope.str_isMakingAlts = 'is making alternatives...';
			$scope.str_isChoosingOpening = 'is Choosing Opening...';
			$scope.str_swapOrNot = 'swap or not';
			$scope.str_isChoosingAlts = 'is choosing alternatives...';
			$scope.str_joinGame = 'Join';
			$scope.str_participant = 'Participant';
			$scope.str_watchGame = 'Watch';
			$scope.str_userInfo = 'User Information';
			$scope.str_profile = 'Profile';
			$scope.str_username = 'Username';
			$scope.str_email = 'E-mail';
			$scope.str_black = 'Black';
			$scope.str_white = 'White';
			$scope.str_moves = 'Moves';
			$scope.str_result = 'Result';
			$scope.str_record = 'Record';
			$scope.str_last10Games = 'Last 10 Games';
			$scope.str_confirmAlts = 'Confirm these alternatives';
			$scope.str_confirmOpening = 'Confirm this opening';
			$scope.str_undo = 'Undo';
			$scope.str_announceList = 'Announce List';
			$scope.str_noStartTime = 'Please choose one at least.';
			$scope.str_noBasicTime = 'minimum: 1 minute';
			$scope.str_morePerMoveTime = 'minimum: 5 seconds';
			$scope.str_morePlusTime = 'minimum: 5 seconds';
			$scope.str_notInt = 'Please input integer.';
			$scope.str_finish = 'Finish';
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
			$scope.str_category = '分類';
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
			$scope.str_category = 'Category';
			
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

var translate_serverMsg = function(){
	console.log('會叫幾次呢?');
	console.log(new Date);
	var i=0;
	var langs = {
		English: i++,
		Chinese: i
	};

	var dict = {
		gomoku: ['Gomoku', '普通規則'],
		renju: ['Renju', '日式規則'],
		classic: ['Classic', '經典規則'],
		yamaguchi: ['Yamaguchi', '山口規則']
	};
	
	return function(str, language) {
		return dict[str][langs[language]];
	};
}();

/*
function translate_serverMsg_backup(str, language){
	//console.log('bug? 好像會一直呼叫');
	if(str=='gomoku'){
		if(language=='English') return 'Gomoku';
		if(language=='Chinese') return '普通規則';
	}
	else if(str=='renju'){
		if(language=='English') return 'Renju';
		if(language=='Chinese') return '日式規則';
	}
	else if(str=='classic'){
		if(language=='English') return 'Classic';
		if(language=='Chinese') return '經典規則';
	}
	else if(str=='yamaguchi'){
		if(language=='English') return 'Yamaguchi';
		if(language=='Chinese') return '山口規則';
	}
	else{
		if(language=='English') return 'Unknow String';
		if(language=='Chinese') return '無法辨識的字串';
	}
}
*/
function translate_result(str, language){
	//console.log('start to translate result');
	if(language=='English') return str;
	if(language=='Chinese'){
		if(str=='Attains five.') return '連五勝';
		if(str=='Draw') return '和棋';
		var bw = str.substr(0, str.indexOf(' '));
		var result = str.substr(str.indexOf(' '), str.length);
		if(bw=='Black')
			str = '黑方';
		else if(bw=='White')
			str = '白方';
		else{
			console.log('Unknown string', str);
			return;
		}
		
		if(result==' is double four.')
			str += '四四禁';
		else if(result==' is double three.')
			str += '三三禁';
		else if(result==' is overline.')
			str += '長連';
		else if(result==' time up.')
			str += '超時';
		else if(result==' resigned.')
			str += '投降';
		else str = 'Unknown String.';
		
		return str;
	}
	console.log('Unknown Language');
	return str;
	
	
	
}