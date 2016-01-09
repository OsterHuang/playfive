
lobbyPage = angular.module('lobbyPage', ['ngStorage']);

lobbyPage.controller('lobbyController', function ($rootScope, $scope, $http, $localStorage, $document, $window, $localStorage, socket) {

	$scope.timeRuleChecked = true;

	$scope.lobbyChat = {
        content:'',
        messages:[],
        isAutoScroll: true
    };
    $scope.lobbyChatOut = {content:''};
    
    $scope.searchOpp = {any:''} 
    
    $scope.newGame = {
        rule:'gomoku',
        isTentitiveBlack:true,
        isRating:false,
        isMySelf:false,
        hasBasicTime:false,
        hasPerMoveTime:true,
        hasPlusTime:false,
        basicTime:0,
        perMoveTime:30,
        perMovePlusTime:0
    }
    
    $scope.openGreateGameModal = function() {
        $('#createGameDialog').modal({
            keyboard: true
        });
    };
    
    $scope.cancelMyCreatedGame = function() {
        socket.emit('lobby-cancel-game', {uid:$rootScope.user.myCreatedGame.uid, creator:$rootScope.user.myCreatedGame.creator}, null);
    };
    
	window.getScopeVar = function(attr) {
		console.log($scope[attr]);
	};
	
    $scope.timeRuleCheck = function(){
		$scope.timeRuleChecked = false;
		
		//沒有基本時間&沒有每手時限
		if(!$scope.newGame.hasBasicTime && !$scope.newGame.hasPerMoveTime)
			return;

		var bt = window.parseInt($scope.newGame.basicTime);
		var pmt = window.parseInt($scope.newGame.perMoveTime);
		var pmpt = window.parseInt($scope.newGame.perMovePlusTime);

	    //三者都為0
		if(bt==0 && pmt==0 && pmpt==0)
			return;
		
		//有負值
		//非整數：轉為整數後與原本不同
		if ($scope.newGame.hasBasicTime){
			if(bt<=0) return;
			if($scope.newGame.basicTime!=bt) return;
		}
		if ($scope.newGame.hasPerMoveTime){
			if(pmt<=0) return;
			if($scope.newGame.perMoveTime!=pmt) return;
		}
		if ($scope.newGame.hasPlusTime){
			if(pmpt<=0) return;
			if($scope.newGame.perMovePlusTime!=pmpt) return;
		} 
    
		$scope.timeRuleChecked = true;

		return;
	}
	
	$scope.timeRuleCheck();

	$scope.confirmCreteGame = function() {
        
        var game = {
            creator:{nickname:$rootScope.user.nickname, username:$rootScope.user.username},
            rule:$scope.newGame.rule,
            isTentitiveBlack:$scope.newGame.isTentitiveBlack,
            isRating:$scope.newGame.isRating,
            specificOpp:$scope.newGame.specificOpp,
            timeRule:{}
        };
        if ($scope.newGame.hasBasicTime) {
            game.timeRule.basicTime = $scope.newGame.basicTime;
        }
        if ($scope.newGame.hasPerMoveTime) {
            game.timeRule.perMoveTime = $scope.newGame.perMoveTime;
        }
        if ($scope.newGame.hasPlusTime) {
            game.timeRule.perMovePlusTime = $scope.newGame.perMovePlusTime;
        }
        
        socket.emit('lobby-create-game', {newGame:game}, null);
		
    };
    
    $scope.joinGame = function(game) {
        socket.emit('lobby-start-game', {joinGame:game, participant:$rootScope.user.username}, null);
    }
    
    $scope.watchGame = function(game) {
        socket.emit('lobby-watch-game', {watchGame:game, participant:$rootScope.user.username}, null);
    }
    
    $scope.chatInLobby = function() {
        if ($rootScope.user.status === 'silent') {
            $rootScope.message = 'Your are muted.';
            $("#message").alert();
            $("#message").fadeTo(5000, 500).slideUp(500, function() {});
            return;
        }
		if($scope.lobbyChatOut.content==''){return;}
        socket.emit('lobby-chat-send', {from:$rootScope.user.nickname, content:$scope.lobbyChatOut.content});
    }
    
    $scope.confirmKick = function(pUser) {
        $rootScope.modal.title = 'Kick Confirm';
        $rootScope.modal.message = "Are you sure to kick the user " + pUser.nickname + "?";
        $rootScope.modal.button1Label = 'Yes';
        $rootScope.modal.button2Label = 'No';
        $rootScope.modal.clickButton1 = function() {
            socket.emit('lobby-kick-user', pUser);
        }
        $rootScope.modal.clickButton2 = function() {
            //Nothing here
        }
        $('#modalDialog').modal({
            keyboard: true
        });
    }
    
    $scope.confirmBan = function(pUser) {
        $rootScope.modal.title = 'Ban Confirm';
        $rootScope.modal.message = "Are you sure to ban the user " + pUser.nickname + "?";
        $rootScope.modal.button1Label = 'Yes';
        $rootScope.modal.button2Label = 'No';
        $rootScope.modal.clickButton1 = function() {
            socket.emit('lobby-ban-user', pUser);
        }
        $rootScope.modal.clickButton2 = function() {
            //Nothing here
        }
        $('#modalDialog').modal({
            keyboard: true
        });
    }
    
    $scope.confirmMute = function(pUser) {
        $rootScope.modal.title = 'Mute Confirm';
        $rootScope.modal.message = "Are you sure to mute the user " + pUser.nickname + "?";
        $rootScope.modal.button1Label = 'Yes';
        $rootScope.modal.button2Label = 'No';
        $rootScope.modal.clickButton1 = function() {
            socket.emit('lobby-mute-user', pUser);
        }
        $rootScope.modal.clickButton2 = function() {
            //Nothing here
        }
        $('#modalDialog').modal({
            keyboard: true
        });
    }
    
    $scope.unmute = function(pUser) {
        socket.emit('lobby-unmute-user', pUser);
    }
    
    $scope.onChatScroll = function(event) {
        $scope.lobbyChat.isAutoScroll = false;
        $("#btnBecomeAutoScroll").show();
    }
    
    $scope.becomeAutoScroll = function() {
        $('.chat').animate(
            {scrollTop: $('.chat')[0].scrollHeight}, 
            'fast',
            function() {
                $scope.lobbyChat.isAutoScroll = true;
                $("#btnBecomeAutoScroll").hide();
                console.log('Become auto scroll:', $scope.lobbyChat.isAutoScroll);
            }
        );
    }
    
    // ---- Choose Opponent ----
    $scope.openChooseOppDialog = function() {
        $('#chooseOppDialog').modal({
            keyboard: true
        });
    }
    
    $scope.chooseOppFilter = function(itUser) {
//        if (itUser.username === $rootScope.user.username)
//            return false;
        
        if (itUser.nickname.indexOf($scope.searchOpp.any) > -1) {
            return true;
        } else {
            return false;
        }
    }
    
    $scope.chooseOpp = function(pUser) {
        $scope.newGame.specificOpp = pUser;
    }
    
    $scope.cancelChooseOpp = function() {
        $scope.newGame.specificOpp = null;
    }
    
    // ----
    //
    // ----
    
    socket.on('lobby-user-list', function (data) {
        console.log(data);
        $scope.onlineUsers = data.onlineUsers;
    });
    
    socket.on('lobby-game-list', function (data) {
        console.log(data);
        $scope.createdGames = data.createdGames;
        $scope.progressingGames = data.progressingGames;
        $scope.hasMyCreatedGame();
        $scope.hasMyProgressingGame();
    });  
    
    socket.on('lobby-game-list-refresh', function (data) {
        console.log(data);
        $scope.createdGames = data.createdGames;
        $scope.progressingGames = data.progressingGames;
    });  
    
    socket.on('lobby-watched-game', function (data) {
        console.log(data);
        socket.emit('lobby-join-game', {joinGame:data});
    });  
    
    socket.on('lobby-chat-receive', function(message) {
        console.log('On lobby-chat-receive', message);
        message.formatedSendTime = formatTime(new Date(message.sendTime));
        $scope.lobbyChat.messages.push(message);
        
        if (message.from === $rootScope.user.nickname) {
            $scope.lobbyChatOut.content = '';
        }
        
        if ($scope.lobbyChat.isAutoScroll) {
            $('.chat').animate(
                {scrollTop: $('.chat')[0].scrollHeight}, 
                'fast',
                function() {
                    $(".chat").scroll(function(event) {
                        $scope.onChatScroll(event);
                    });
                    $scope.lobbyChat.isAutoScroll = true;
                    $("#btnBecomeAutoScroll").hide();
                }
            );
        }
    });
    
    // ---- U ----
    $scope.hasMyCreatedGame = function() {
        for (var i = 0; i < $scope.createdGames.length; i++) {
            if ($scope.createdGames[i].creator.username == $rootScope.user.username) {
                $rootScope.user.myCreatedGame = $scope.createdGames[i];
                return;
            }
        }
        
        $scope.user.myCreatedGame = null;
    }
    
    $scope.hasMyProgressingGame = function() {
        for (var i = 0; i < $scope.progressingGames.length; i++) {
            if ($scope.progressingGames[i].black.username === $rootScope.user.username ||
                $scope.progressingGames[i].white.username === $rootScope.user.username) {
                if (!$rootScope.user.myProgressingGame) {
                    console.log('emit join game', $rootScope.user);
                    socket.emit('lobby-join-game', {joinGame:$scope.progressingGames[i]});
                    return;
                }
            }
        }
        console.log('No my game here.', $rootScope.user);
    }
    
	/*$scope.translate = function(language){
		$localStorage.language = language;
		window.translate($scope, language, 'main.html');
	}*/
});
