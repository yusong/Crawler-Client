define(['modules/http_agent'], function(http_agent){

	var Weibo = function() {};

	var weiboHeaders = {
		Referer : 'http://weibo.com/signup/signup.php?inviteCode=2813262187',
		Cookie : [
			'_s_tentry=www.baidu.com',
			'ALF=1378985927',
			'Apache=4590659155986.985.1376378601226',
			'appkey=',
			'lang=zh-cn',
			'login_sid_t=df203cc3f83db147aae69a38969fc7dc',
			'myuid=2813262187',
			'SINAGLOBAL=4590659155986.985.1376378601226',
			'SinaRot_wb_r_topic=34',
			'SSOLoginState=1376393927',
			'SUE=es%3D7e4c5c719dc7f74ff4ae05736a14f2f1%26ev%3Dv1%26es2%3Dca99ffa39bd28c1e599fcc49c82e0d24%26rs0%3DhNUjwOto4VG63LM0HGzkB8VwIK57TZCB85GDJoCowZLIR7Cwquz1u2Ue9rrP42AAdYKIM62PsJckRqE6K6XIV38aQVyEPJjjz%252FCSGg1%252FpFSSEmogktTx5kO1yj2NKT0zr6kfkn19lKwcnI1VnYAmG4aWLg9afXSngCgidrKakp8%253D%26rv%3D0',
			'SUP=cv%3D1%26bt%3D1376393927%26et%3D1376480327%26d%3Dc909%26i%3D1636%26us%3D1%26vf%3D0%26vt%3D0%26ac%3D0%26st%3D0%26uid%3D2813262187%26name%3D1810542337%2540qq.com%26nick%3Dsysu_Ys%26fmp%3D%26lcp%3D2013-08-13%252015%253A29%253A03',
			'SUS=SID-2813262187-1376393927-JA-36hc2-7d8788d4d2575f6b104970ff273a7258',
			'ULV=1376378601229:1:1:1:4590659155986.985.1376378601226:',
			'un=1810542337@qq.com',
			'UOR=www.baidu.com,weibo.com,login.sina.com.cn',
			'USRHAWB=usrmdins311146',
			'USRUG=usrmdins41450',
			'v5reg=usrmdins1030',
			'wvr=5'
		]
	};

	Weibo.prototype.fans = function(url, callback) {
		http_agent(url, {type: 'POST', headers: weiboHeaders}, function(err, dom){
			if(err) {
				console.log('[Fetcher] weibo.funs Error');
				callback(err);
			} 
			else {
				console.log(dom);
				callback(null, null);
			}
		});
	};


	return new Weibo();

});