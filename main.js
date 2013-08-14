require(['modules/worker', 'tools/jquery-1.9.1.min', 'modules/http_agent'], function(worker, jq, agent) {

	chrome.browserAction.onClicked.addListener( worker.turn_on_off.bind(worker) );
	worker.turn_on_off();

	// agent('http://weibo.com/u/2813262187', {type: 'POST', headers: {Cookie: 'a', Referer:'http://weibo.com/signup/signup.php?inviteCode=2813262187'}, cookies: 'UOR=www.baidu.com,weibo.com,login.sina.com.cn; SINAGLOBAL=4590659155986.985.1376378601226; ULV=1376442972778:2:2:2:6943763627140.291.1376442972725:1376378601229; un=1810542337@qq.com; SinaRot_wb_r_topic=38; myuid=2813262187; lang=zh-cn; USRUG=usrmdins41446; USRHAWB=usrmdins31160; _s_tentry=login.sina.com.cn; Apache=6943763627140.291.1376442972725; login_sid_t=a09ff2f6e268df8f676a824f6aa5fea3; SUS=SID-2813262187-1376443172-JA-8fzgc-321707ce435087ade01d30dd37a17258; SUE=es%3D6f7c661140ddaa6f999eb1e02c731f22%26ev%3Dv1%26es2%3D460c8500424fdadb8144c1db57cf1782%26rs0%3D0dvuLjzeg0tkIP9jTkpDHQgJkwHhV3EcO5cxdCiM5spCBudJfqeiysaCinrUsI7K%252BjVxqbz06fe0Ub7NN93XfLEggFuKZNoc%252FAJ40I1htgwKKWmaR3b1BvcgRmx2ExOqbUupSyzHQo8rS%252FhAXB856y68rwfm%252F6qKbqLcq2PgzN0%253D%26rv%3D0; SUP=cv%3D1%26bt%3D1376443172%26et%3D1376529572%26d%3Dc909%26i%3Df868%26us%3D1%26vf%3D0%26vt%3D0%26ac%3D0%26st%3D0%26uid%3D2813262187%26name%3D1810542337%2540qq.com%26nick%3Dsysu_Ys%26fmp%3D%26lcp%3D2013-08-13%252015%253A29%253A03; ALF=1379035172; SSOLoginState=1376443172; wvr=5'}, function(err, result){
	// 	console.log(result);
	// });

	// agent('http://weibo.com/zuozuomuxifans', {type: 'POST', headers: {
	// 	Referer : 'http://weibo.com/signup/signup.php?inviteCode=2813262187',
	// 	Cookie : [
	// 		'_s_tentry=www.baidu.com',
	// 		'ALF=1378985927',
	// 		'Apache=4590659155986.985.1376378601226',
	// 		'appkey=',
	// 		'lang=zh-cn',
	// 		'login_sid_t=df203cc3f83db147aae69a38969fc7dc',
	// 		'myuid=2813262187',
	// 		'SINAGLOBAL=4590659155986.985.1376378601226',
	// 		'SinaRot_wb_r_topic=34',
	// 		'SSOLoginState=1376393927',
	// 		'SUE=es%3D7e4c5c719dc7f74ff4ae05736a14f2f1%26ev%3Dv1%26es2%3Dca99ffa39bd28c1e599fcc49c82e0d24%26rs0%3DhNUjwOto4VG63LM0HGzkB8VwIK57TZCB85GDJoCowZLIR7Cwquz1u2Ue9rrP42AAdYKIM62PsJckRqE6K6XIV38aQVyEPJjjz%252FCSGg1%252FpFSSEmogktTx5kO1yj2NKT0zr6kfkn19lKwcnI1VnYAmG4aWLg9afXSngCgidrKakp8%253D%26rv%3D0',
	// 		'SUP=cv%3D1%26bt%3D1376393927%26et%3D1376480327%26d%3Dc909%26i%3D1636%26us%3D1%26vf%3D0%26vt%3D0%26ac%3D0%26st%3D0%26uid%3D2813262187%26name%3D1810542337%2540qq.com%26nick%3Dsysu_Ys%26fmp%3D%26lcp%3D2013-08-13%252015%253A29%253A03',
	// 		'SUS=SID-2813262187-1376393927-JA-36hc2-7d8788d4d2575f6b104970ff273a7258',
	// 		'ULV=1376378601229:1:1:1:4590659155986.985.1376378601226:',
	// 		'un=1810542337@qq.com',
	// 		'UOR=www.baidu.com,weibo.com,login.sina.com.cn',
	// 		'USRHAWB=usrmdins311146',
	// 		'USRUG=usrmdins41450',
	// 		'v5reg=usrmdins1030',
	// 		'wvr=5'
	// 	]
	// }}, function(err, result){
	// 	console.log(result);
	// });


	// $.ajax({
	// 	url : 'http://weibo.com/u/2813262187',
	// 	type : 'GET',
	// 	success : function(data, status){
	// 		console.log(data);
	// 	},
	// 	error : function (XMLHttpRequest, textStatus, errorThrown) {
	// 		console.log('ERROR');
	// 	}
	// });

	// $.ajax({
	// 	url : 'http://www.tmall.com/go/rgn/mfp2012/all-cat-asyn.php',
	// 	type : 'GET',
	// 	success : function(data, status){
	// 		// console.log(data);
	// 		// $(data).find('.j_SubView .subItem .subItem-cat a').each(function(){
	// 		// 	console.log($(this).attr("href") + $(this).html());
	// 		// });
	// 			console.log($(data).find('.j_SubView .subItem .subItem-cat a'));
	// 	},
	// 	error : function (XMLHttpRequest, textStatus, errorThrown) {
	// 		console.log('ERROR');
	// 	}
	// });

	// $.ajax({
	// 	url : 'http://channel.jd.com/kitchenware.html',
	// 	type : 'POST',
	// 	success : function(data, status){
	// 		console.log(data);
	// 		$(data).find('div#sortlist .con a').each(function(){
	// 			console.log($(this).attr("href") + $(this).attr("title"));
	// 		});
	// 	},
	// 	error : function (XMLHttpRequest, textStatus, errorThrown) {
	// 		console.log('ERROR');
	// 	}
	// });

	// $.ajax({
	// 	url : 'http://list.jd.com/6196-6197-6199-0-0-0-0-0-0-0-1-1-1-1.html',
	// 	type : 'POST',
	// 	success : function(data, status){
	// 		$(data).find('#plist li .p-name a').each(function(){
	// 			console.log($(this).attr("href"));
	// 		});
	// 		$(data).find('.pagin-m .next').each(function(){
	// 			console.log($(this).attr("href"));
	// 		});
	// 	},
	// 	error : function (XMLHttpRequest, textStatus, errorThrown) {
	// 		console.log('ERROR');
	// 	}
	// });

	// $.ajax({
	// 	url : 'http://item.jd.com/207551.html',
	// 	type : 'GET',
	// 	success : function(data, status){
	// 		// console.log(data);

	// 		var productInfo = {};
	// 		productInfo.name = $(data).find('#name h1').html(); // 商品名
	// 		console.dir(productInfo);
			
	// 	},
	// 	error : function (XMLHttpRequest, textStatus, errorThrown) {
	// 		console.log('ERROR');
	// 	}
	// });

});