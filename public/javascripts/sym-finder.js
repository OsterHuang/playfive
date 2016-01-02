function symFinder(stones){
	//計算黑子中點Ｍb(p, q), 白子中點Ｍw(r, s)。
	p = (stones[0].ordinate.x + stones[2].ordinate.x)/2;
	q = (stones[0].ordinate.y + stones[2].ordinate.y)/2;
	console.log("middle of black is: %f, %f", p, q);
	r = (stones[1].ordinate.x + stones[3].ordinate.x)/2;
	s = (stones[1].ordinate.y + stones[3].ordinate.y)/2;
	console.log("middle of white is: (%f, %f)", r, s);
	
	x = stones[4].ordinate.x;
	y = stones[4].ordinate.y;
	
	
	//計算兩中點向量(a, b)
	a = p-r;
	b = q-s;
	console.log("兩中點向量 (%f, %f)", a, b);
	
	var arr = [];
	
	if(a==0 && b==0){ //點對稱
		console.log('symType 1');
		if(x==p && y==q) //(x, y)就是旋轉中心 => (x, y)沒有對稱點
			return arr;
		
		console.log('???');
		//旋轉對稱點不是自己
		arr[0] = {ordinate: {x: 2*p-x, y: 2*q-y}};
		
		//計算黑子向量(Xb, Yb)
		//計算白子向量(Xw, Yw)
		Xb = stones[0].ordinate.x - stones[2].ordinate.x;
		Yb = stones[0].ordinate.y - stones[2].ordinate.y;
		Xw = stones[1].ordinate.x - stones[3].ordinate.x;
		Yw = stones[1].ordinate.y - stones[3].ordinate.y;
		
		console.log('Xb=',Xb,'Yb=',Yb,'Xw=',Xw,'Yw=',Yw);
		
		if((Xb==Xw && Xw==0) || (Yb==Yw && Yw==0) || (Xb==0 && Yw==0) || (Xw==0 && Yb==0)){
			consol.log('恆星對稱白4');
			//線對稱, 上下or左右  ex.松月天地雙止 || 恆星對稱白4
			var tempX = 2*p-x;
			var tempY = y;
			if((tempX==x && tempY==y) || (tempX==arr[0].ordinate.x && tempY==arr[0].ordinate.y)){
				//對稱點(tempX, tempY)是(自己 or arr[0])
				return arr;
			}
			arr[1] = {ordinate: {x: tempX, y: tempY}};
			arr[2] = {ordinate: {x: x, y: (2*q-y)}};
			return arr;
		}
		if(((Xb/Yb)==(Xw/Yw)) || (Xb==Yb && Xw==-Yw) || (Xb==-Yb && Xw==Yw)){
			console.log('花月打xx');
			//線對稱, 45度上下&左右  ex.斜月, 白四下在黑三左下方
			//(x, y)之對稱點為 (y-q+p, x-p+q),(p+q-y, p+q-x)
			tempX = y-q+p;
			tempY = x-p+q;
			if((tempX==x && tempY==y) || (tempX==arr[0].ordinate.x && tempY==arr[0].ordinate.y)){
				//對稱點(tempX, tempY)是(自己 or arr[0])
				return arr;
			}
			arr[1] = {ordinate: {x: tempX, y: tempY}};
			arr[2] = {ordinate: {x: (p+q-y), y: (p+q-x)}};
			return arr;
		}
	}
	else{
		var vectorBlack = 
			{x: stones[0].ordinate.x-stones[2].ordinate.x,
			 y: stones[0].ordinate.y-stones[2].ordinate.y};
		var vectorWhite = 
			{x: stones[1].ordinate.x-stones[3].ordinate.x,
			 y: stones[1].ordinate.y-stones[3].ordinate.y};
		
		if(vectorBlack.x*b+vectorBlack.y*a==0 && vectorWhite.x*b+vectorWhite.y*a==0){
			if(a==0){ //對稱軸垂直，為左右對稱
				console.log('symType = 2');
				
				if(x!=p)
					arr[0] = {ordinate: {x: 2*p-x, y: y}};
			}
			else if(b==0){ //對稱軸水平，為上下對稱
				console.log('symType = 3');
				if(y!=q) arr[0] = {ordinate: {x: x, y: 2*q-y}};
			}
			else if(a==b){ //對稱軸為／方向
				console.log('symType = 4');
				var tempX = y-q+p;
				var tempY = x-p+q;
				if(x!=tempX && y!=tempY)　//平移, xy座標互換, 平移回去
					arr[0] = {ordinate: {x: tempX, y: tempY}};
			}
			else if(a==-b){　//對稱軸為＼方向
				console.log('symType = 5');
				var tempX = p+q-y;
				var tempY = p+q-x;
				if(x!=tempX && y!=tempY)　//平移, 加負號, xy座標互換, 平移回去
					arr[0] = {ordinate: {x: tempX, y: tempY}};
			}
			return arr;
		}
	}
}


/*
if(a==0 && b==0){ //點對稱
	(x, y)之對稱點為(2p-x, 2q-y)
	
	計算黑子向量(Xb, Yb)
	計算白子向量(Xw, Yw)
	if(Xb==Xw==0 or Yb==Yw==0){
		//線對稱, 上下&左右  ex.松月天地雙止
		(x, y)之對稱點為(2p-x, y),(x, 2q-y)
	}
	else if(Xb/Yb==Xw/Yw){
		//線對稱, 45度上下&左右  ex.斜月, 白四下在黑三左下方
		(x, y)之對稱點為 (y-q+p, x-p+q),(p+q-y, p+q-x)
	}
}

else if(a==0){ //對稱軸垂直，為左右對稱
	(x, y)之對稱點為(2p-x, y)
}
else if(b==0){ //對稱軸水平，為上下對稱
	(x, y)之對稱點為(x, 2q-y)
}
else if(a==b){ //對稱軸為右上至左下
	//平移, xy座標互換, 平移回去
	(x, y)之對稱點為 (y-q+p, x-p+q)
}
else if(a==-b){ //對稱軸為左上至右下
	//平移, 加負號, xy座標互換, 平移回去
	(x, y)之對稱點為 (q-y+p, p-x+q)=(p+q-y, p+q-x)
	//好特別!!這式子漂亮到有點懷疑..等清醒一點可能需要驗算一下 XD
}
else
	非對稱
*/